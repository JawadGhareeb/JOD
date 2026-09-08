import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import Dialog from "@/src/components/ui/Dialog";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useAuthStatus } from "@/src/features/auth/queries";
import {
  useAcceptHelpOffer,
  useAgreeHelpOffer,
  useCancelHelpOffer,
  useConfirmProvided,
  useConfirmReceived,
  useContactHelpOffer,
  useHelpOffer,
  useRejectHelpOffer,
  useUpdateHelpRequestStatus,
} from "@/src/features/help-offers/queries";
import type { HelpOfferStatus } from "@/src/features/help-offers/types";
import { useToast } from "@/src/providers/ToastProvider";

const labels: Record<HelpOfferStatus, string> = {
  pending: "بانتظار موافقة المستفيد",
  accepted: "تم قبول العرض",
  contacting: "جاري التواصل",
  agreed: "تم الاتفاق",
  completed: "تمت المساعدة",
  rejected: "مرفوض",
  cancelled: "ملغي",
};

function Step({ done, children }: { done: boolean; children: string }) {
  return <Text size="2xs" className={done ? "text-primary-400" : "text-gray-400"}>{done ? "✓" : "○"} {children}</Text>;
}

export default function HelpOfferDetailsPage() {
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const { user } = useAuthStatus();
  const toast = useToast();
  const query = useHelpOffer(id);
  const offer = query.data;
  const accept = useAcceptHelpOffer();
  const reject = useRejectHelpOffer();
  const contact = useContactHelpOffer();
  const agree = useAgreeHelpOffer();
  const cancel = useCancelHelpOffer();
  const provided = useConfirmProvided();
  const received = useConfirmReceived();
  const statusUpdate = useUpdateHelpRequestStatus();
  const [reason, setReason] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const busy = accept.isPending || reject.isPending || contact.isPending || agree.isPending || cancel.isPending || provided.isPending || received.isPending || statusUpdate.isPending;

  const run = async (promise: Promise<unknown>, message: string) => {
    try {
      await promise;
      toast.success(message);
    } catch {
      toast.error("تعذر تنفيذ الإجراء. حدّث البيانات وحاول مجدداً.");
    }
  };

  const handleCancel = async () => {
    if (!id || reason.trim().length < 3) return;
    try {
      await cancel.mutateAsync({ id, reason: reason.trim() });
      setReason("");
      setCancelDialogOpen(false);
      toast.success("تم إلغاء العرض.");
      await query.refetch();
    } catch {
      toast.error("تعذر إلغاء عرض المساعدة. حدّث البيانات وحاول مجدداً.");
    }
  };

  if (query.isLoading) return <Container className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تفاصيل عرض المساعدة" /><View className="gap-2"><CardSkeleton height={140} margin={0} /><CardSkeleton height={260} margin={0} /></View></Container>;
  if (!offer || !id) return <Container className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تفاصيل عرض المساعدة" /><Text>تعذر العثور على عرض المساعدة.</Text></Container>;

  const isHelper = offer.helper.id === user?.id;
  const activeCancelable = ["pending", "accepted", "contacting", "agreed"].includes(offer.status);

  return (
    <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تفاصيل عرض المساعدة" />
      <View className="gap-2">
        <View className="flex-row-reverse items-center justify-end">
          <View className="rounded-full bg-primary-400/10 px-3 py-1"><Text size="2xs" className="text-primary-400">{labels[offer.status]}</Text></View>
        </View>

        <Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">{offer.post?.title || "طلب مساعدة"}</Text>
          <Text size="xs" className="text-gray-500 dark:text-gray-300">المساعد: {offer.helper.name}</Text>
          <Text size="xs">النوع: {offer.type}</Text>
          {offer.amount ? <Text size="xs">المبلغ: {offer.amount.toLocaleString("ar-SY")} ل.س</Text> : null}
          {offer.description ? <Text size="xs">{offer.description}</Text> : null}
          {offer.cancelReason ? <View className="mt-2 rounded-xl border border-error-300/20 bg-error-300/5 p-3"><Text size="2xs" className="text-gray-500 dark:text-gray-300">سبب الإلغاء</Text><Text size="xs" className="mt-1 text-error-300">{offer.cancelReason}</Text></View> : null}
          {offer.rejectionReason ? <View className="mt-2 rounded-xl border border-error-300/20 bg-error-300/5 p-3"><Text size="2xs" className="text-gray-500 dark:text-gray-300">سبب الرفض</Text><Text size="xs" className="mt-1 text-error-300">{offer.rejectionReason}</Text></View> : null}
          {offer.contactMethod || offer.contactValue ? (
            <View className="mt-2 rounded-xl bg-primary-400/5 p-3">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">بيانات التواصل الخاصة</Text>
              <Text size="xs">{offer.contactMethod || "-"}{offer.contactValue ? ` • ${offer.contactValue}` : ""}</Text>
            </View>
          ) : null}
        </Card>

        <Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400">
          <Text size="xs" weight="semibold">حالة التنفيذ</Text>
          <Step done={Boolean(offer.createdAt)}>تم إرسال عرض المساعدة</Step>
          <Step done={Boolean(offer.acceptedAt)}>تم قبول العرض</Step>
          <Step done={Boolean(offer.contactedAt)}>تم بدء التواصل</Step>
          <Step done={Boolean(offer.helperAgreedAt)}>المساعد أكد الوصول إلى اتفاق</Step>
          <Step done={Boolean(offer.receiverAgreedAt)}>المستفيد أكد الوصول إلى اتفاق</Step>
          <Step done={Boolean(offer.agreedAt)}>تم الاتفاق من الطرفين</Step>
          <Step done={Boolean(offer.helperConfirmedAt)}>المساعد أكد تقديم المساعدة</Step>
          <Step done={Boolean(offer.receiverConfirmedAt)}>المستفيد أكد الاستلام أو الاستفادة</Step>
        </Card>

        <View className="gap-2">
          {offer.can.accept ? <Button fullWidth disabled={busy} onPress={() => void run(accept.mutateAsync({ id }), "تم قبول العرض.")}>قبول عرض المساعدة</Button> : null}
          {offer.can.reject ? <Button fullWidth variant="tertiary" disabled={busy} onPress={() => void run(reject.mutateAsync({ id }), "تم رفض العرض.")}>رفض العرض</Button> : null}
          {offer.can.contact ? <Button fullWidth disabled={busy} onPress={() => void run(contact.mutateAsync({ id }), "تم تسجيل بدء التواصل.")}>تم بدء التواصل</Button> : null}
          {offer.can.agree ? <Button fullWidth disabled={busy} onPress={() => void run(agree.mutateAsync({ id }), "تم تسجيل تأكيدك للاتفاق.")}>تأكيد التوصل لاتفاق</Button> : null}
          {offer.can.confirmProvided ? <Button fullWidth disabled={busy} onPress={() => void run(provided.mutateAsync({ id }), "تم تأكيد تقديم المساعدة.")}>تأكيد أنني قدمت المساعدة</Button> : null}
          {offer.can.confirmReceived ? <Button fullWidth disabled={busy} onPress={() => void run(received.mutateAsync({ id }), "تم تأكيد استلام المساعدة.")}>تأكيد الاستلام أو الاستفادة</Button> : null}
          {offer.post.helpStatus === "fulfilled" && !isHelper ? <Button fullWidth variant="tertiary" disabled={busy} onPress={() => void run(statusUpdate.mutateAsync({ postId: offer.postId, status: "open" }), "تم إعادة فتح طلب المساعدة.")}>إعادة فتح طلب المساعدة</Button> : null}
          {activeCancelable ? <Button fullWidth variant="tertiary" disabled={busy} onPress={() => setCancelDialogOpen(true)}>إلغاء عرض المساعدة</Button> : null}
        </View>
      </View>
      <Dialog visible={cancelDialogOpen} title="إلغاء عرض المساعدة" onClose={() => { if (!cancel.isPending) setCancelDialogOpen(false); }} cancelable={!cancel.isPending}>
        <View className="gap-3"><Text size="xs" className="leading-6 text-gray-500 dark:text-gray-300">اكتب سبب الإلغاء. سيظهر السبب للطرف الآخر ضمن تفاصيل العرض.</Text><Input fullWidth value={reason} onChangeText={setReason} multiline placeholder="سبب الإلغاء" maxLength={2000} showStatusIcon={false} /><View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth variant="tertiary" disabled={cancel.isPending} onPress={() => setCancelDialogOpen(false)}>رجوع</Button></View><View className="flex-1"><Button fullWidth loading={cancel.isPending} disabled={cancel.isPending || reason.trim().length < 3} onPress={() => void handleCancel()}>تأكيد الإلغاء</Button></View></View></View>
      </Dialog>
    </Container>
  );
}
