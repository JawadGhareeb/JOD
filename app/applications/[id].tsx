import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useApplication, useWithdrawApplication } from "@/src/features/applications/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { useToast } from "@/src/providers/ToastProvider";

const STATUS_LABELS: Record<string, string> = { pending: "قيد الانتظار", approved: "مقبول", accepted: "مقبول", rejected: "مرفوض", withdrawn: "مسحوب" };

export default function ApplicationDetailsPage() {
  const raw = useLocalSearchParams<{ id?: string | string[] }>().id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const router = useRouter();
  const toast = useToast();
  const query = useApplication(id);
  const withdraw = useWithdrawApplication();
  const item = query.data;
  const canWithdraw = !!item && !["rejected", "withdrawn"].includes(item.status);

  const handleWithdraw = () => {
    if (!item) return;
    Alert.alert("سحب الطلب", `هل تريد سحب طلبك من حملة «${item.campaignTitle}»؟`, [
      { text: "إلغاء", style: "cancel" },
      { text: "سحب الطلب", style: "destructive", onPress: async () => {
        try {
          await withdraw.mutateAsync(item.id);
          toast.success("تم سحب طلب التطوع.", "تم السحب");
          await query.refetch();
        } catch (error) {
          toast.error(error instanceof ApiClientError ? error.message : "تعذر سحب الطلب.", "حدث خطأ");
        }
      } },
    ]);
  };

  return <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تفاصيل الطلب" /><ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
    {query.isLoading ? <Text size="xs" className="py-8 text-center text-gray-500">جارِ تحميل الطلب...</Text> : null}
    {query.isError ? <Card padding="md"><Text size="xs" className="text-error-300">تعذر تحميل الطلب.</Text><View className="mt-3"><Button size="small" onPress={() => void query.refetch()}>إعادة المحاولة</Button></View></Card> : null}
    {item ? <>
      <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
        <Text weight="semibold" size="base">{item.campaignTitle}</Text>
        <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">{item.organizationName ?? "-"}</Text>
        <View className="mt-4 gap-3">
          <Row label="الحالة" value={STATUS_LABELS[item.status] ?? item.status} />
          <Row label="رقم الهاتف" value={item.phone ?? "-"} />
          <Row label="المدينة" value={item.city ?? "-"} />
          <Row label="تاريخ التقديم" value={item.submittedAt ? new Date(item.submittedAt).toLocaleString("ar") : "-"} />
          <Row label="آخر تحديث" value={item.updatedAt ? new Date(item.updatedAt).toLocaleString("ar") : "-"} />
        </View>
      </Card>
      <View className="gap-2">{canWithdraw ? <Button fullWidth loading={withdraw.isPending} disabled={withdraw.isPending} onPress={handleWithdraw}>سحب الطلب</Button> : null}<Button fullWidth variant="tertiary" onPress={() => router.push({ pathname: "/campaigns/[id]", params: { id: item.campaignId } })}>فتح الحملة</Button></View>
    </> : null}
  </ScrollView></View>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <View className="flex-row-reverse items-center justify-between gap-3"><Text size="xs" className="text-gray-500 dark:text-gray-300">{label}</Text><Text size="xs" weight="medium" className="flex-1 text-left text-dark-100 dark:text-light-50">{value}</Text></View>;
}
