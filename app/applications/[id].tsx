import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Dialog from "@/src/components/ui/Dialog";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useApplication, useWithdrawApplication } from "@/src/features/applications/queries";
import { APP_ERROR_MESSAGES, getArabicErrorMessage } from "@/src/constants/error-messages";
import { useToast } from "@/src/providers/ToastProvider";

const STATUS_LABELS: Record<string, string> = { pending: "بانتظار موافقة المنظمة", under_review: "قيد المراجعة", approved: "تم القبول", accepted: "تم القبول", contacting: "جاري التواصل", completed: "اكتملت المشاركة", rejected: "مرفوض", withdrawn: "منسحب" };

export default function ApplicationDetailsPage() {
  const raw = useLocalSearchParams<{ id?: string | string[] }>().id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const router = useRouter();
  const toast = useToast();
  const query = useApplication(id);
  const withdraw = useWithdrawApplication();
  const [withdrawReason, setWithdrawReason] = useState("");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const item = query.data;
  const canWithdraw = !!item && ["pending", "under_review", "accepted", "approved", "contacting"].includes(item.status);

  const handleWithdraw = async () => {
    if (!item || withdrawReason.trim().length < 3) return;
    try {
      await withdraw.mutateAsync({ id: item.id, reason: withdrawReason.trim() });
      setWithdrawReason("");
      setWithdrawDialogOpen(false);
      toast.success("تم سحب طلب التطوع.", "تم السحب");
      await query.refetch();
    } catch (error) {
      toast.error(getArabicErrorMessage(error, APP_ERROR_MESSAGES.applications.withdraw), "حدث خطأ");
    }
  };

  return <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تفاصيل الطلب" /><ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
    {query.isLoading ? <View className="gap-2"><CardSkeleton height={150} margin={0} /><CardSkeleton height={220} margin={0} /></View> : null}
    {query.isError ? <Card padding="md"><Text size="xs" className="text-error-300">تعذر تحميل الطلب.</Text><View className="mt-3"><Button size="small" onPress={() => void query.refetch()}>إعادة المحاولة</Button></View></Card> : null}
    {item ? <>
      <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
        <Text weight="semibold" size="base">{item.campaignTitle}</Text>
        <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">{item.organizationName ?? "-"}</Text>
        <View className="mt-4 gap-3">
          <Row label="الحالة" value={STATUS_LABELS[item.status] ?? item.status} />
          <Row label="رقم الهاتف" value={item.phone ?? "-"} />
          <Row label="المدينة" value={item.city ?? "-"} />
          <Row label="تاريخ التقديم" value={item.submittedAt ? new Date(item.submittedAt).toLocaleString("ar") : "-"} />
          <Row label="آخر تحديث" value={item.updatedAt ? new Date(item.updatedAt).toLocaleString("ar") : "-"} />
        </View>
        {item.withdrawalReason ? <View className="mt-4 rounded-xl border border-error-300/20 bg-error-300/5 p-3"><Text size="2xs" className="text-gray-500 dark:text-gray-300">سبب سحب الطلب</Text><Text size="xs" className="mt-1 text-error-300">{item.withdrawalReason}</Text></View> : null}
        {item.rejectionReason ? <View className="mt-4 rounded-xl border border-error-300/20 bg-error-300/5 p-3"><Text size="2xs" className="text-gray-500 dark:text-gray-300">سبب رفض الطلب</Text><Text size="xs" className="mt-1 text-error-300">{item.rejectionReason}</Text></View> : null}
      </Card>
      <View className="gap-2">{canWithdraw ? <Button fullWidth variant="tertiary" disabled={withdraw.isPending} onPress={() => setWithdrawDialogOpen(true)}>سحب الطلب</Button> : null}{item.postId ? <Button fullWidth variant="tertiary" onPress={() => router.push({ pathname: "/posts/[id]", params: { id: item.postId! } })}>فتح فرصة التطوع</Button> : item.campaignId ? <Button fullWidth variant="tertiary" onPress={() => router.push({ pathname: "/campaigns/[id]", params: { id: item.campaignId! } })}>فتح الحملة</Button> : null}</View>
    </> : null}
  </ScrollView>
  <Dialog visible={withdrawDialogOpen} title="سحب طلب التطوع" onClose={() => { if (!withdraw.isPending) setWithdrawDialogOpen(false); }} cancelable={!withdraw.isPending}>
    <View className="gap-3">
      <Text size="xs" className="leading-6 text-gray-500 dark:text-gray-300">اكتب سبب سحب الطلب. سيظهر السبب للجهة التي استلمت طلب التطوع.</Text>
      <Input fullWidth value={withdrawReason} onChangeText={setWithdrawReason} multiline placeholder="سبب سحب طلب التطوع" maxLength={1000} showStatusIcon={false} />
      <View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth variant="tertiary" disabled={withdraw.isPending} onPress={() => setWithdrawDialogOpen(false)}>رجوع</Button></View><View className="flex-1"><Button fullWidth loading={withdraw.isPending} disabled={withdraw.isPending || withdrawReason.trim().length < 3} onPress={() => void handleWithdraw()}>تأكيد السحب</Button></View></View>
    </View>
  </Dialog>
  </View>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <View className="flex-row-reverse items-center justify-between gap-3"><Text size="xs" className="text-gray-500 dark:text-gray-300">{label}</Text><Text size="xs" weight="medium" className="flex-1 text-left text-dark-100 dark:text-light-50">{value}</Text></View>;
}
