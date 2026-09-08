import { useLocalSearchParams, useRouter } from "expo-router";
import { EyeOff as EyeOffIcon } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import Dialog from "@/src/components/ui/Dialog";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import {
  useAcceptDonation,
  useAgreeDonation,
  useCancelDonation,
  useCompleteDonation,
  useContactDonation,
  useDonation,
} from "@/src/features/donations/queries";
import type { DonationStatus } from "@/src/features/donations/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { donationContactMethodLabel, donationPaymentMethodLabel, formatWesternAmount, localizeSyrianLocation } from "@/src/helpers/display";
import { useToast } from "@/src/providers/ToastProvider";

const statusLabels: Record<DonationStatus, string> = { pending:"بانتظار الموافقة",accepted:"تم قبول الطلب",contacting:"جاري التواصل",agreed:"تم الاتفاق",completed:"مكتمل",cancelled:"ملغي" };

export default function DonationDetailsPage() {
  const router=useRouter(); const toast=useToast(); const {id}=useLocalSearchParams<{id?:string|string[]}>(); const donationId=Array.isArray(id)?id[0]:id;
  const query=useDonation(donationId); const donation=query.data;
  const accept=useAcceptDonation(), contact=useContactDonation(), agree=useAgreeDonation(), complete=useCompleteDonation(), cancel=useCancelDonation();
  const [confirmedAmount,setConfirmedAmount]=useState(""); const [cancelReason,setCancelReason]=useState(""); const [cancelDialogOpen,setCancelDialogOpen]=useState(false);
  const busy=accept.isPending||contact.isPending||agree.isPending||complete.isPending||cancel.isPending;
  const run=async(action:()=>Promise<unknown>,message:string)=>{try{await action();toast.success(message);await query.refetch();}catch{toast.error("تعذر تنفيذ الإجراء. حدّث البيانات وحاول مجدداً.")}};
  const handleCancel=async()=>{if(!donation||cancelReason.trim().length<3)return;try{await cancel.mutateAsync({id:donation.id,reason:cancelReason.trim()});setCancelDialogOpen(false);setCancelReason("");toast.success("تم إلغاء طلب التبرع.");await query.refetch();}catch{toast.error("تعذر إلغاء طلب التبرع. حدّث البيانات وحاول مجدداً.")}};

  return <Container scrollable className="bg-light-100 dark:bg-dark-300" scrollViewProps={{contentContainerStyle:{paddingHorizontal:16,paddingBottom:40,gap:8}}}>
    <MenuPageHeader title="تفاصيل التبرع" />
    {query.isLoading?<View className="gap-2"><CardSkeleton height={130} margin={0}/><CardSkeleton height={260} margin={0}/></View>:query.isError||!donation?<Card padding="md"><Text size="sm" rtlAlign="center" className="text-error-300">تعذر تحميل تفاصيل التبرع.</Text></Card>:<>
      <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><View className="flex-row-reverse items-start justify-between gap-3"><View className="flex-1"><Text weight="semibold" size="base">{donation.campaignTitle}</Text><Text size="xs" className="mt-1 text-gray-500">{donation.campaignOwnerName??donation.organizationName??donation.organization??"صاحب الحملة"}</Text>{donation.donorName?<Text size="xs" className="mt-1 text-gray-500">المتبرع: {donation.donorName}</Text>:null}</View><View className="rounded-full bg-primary-400/10 px-3 py-1"><Text size="2xs" className="text-primary-400">{statusLabels[donation.status]}</Text></View></View><Text weight="bold" size="lg" className="text-primary-400">{formatWesternAmount(donation.status==="completed"&&donation.confirmedAmount!=null?donation.confirmedAmount:donation.requestedAmount??donation.amount)}</Text></Card>
      <Card padding="md" className="gap-3 border-gray-200"><DetailRow label="طريقة التواصل" value={donationContactMethodLabel(donation.contactMethod)}/><DetailRow label="طريقة الدفع" value={donationPaymentMethodLabel(donation.paymentMethod)}/><DetailRow label="المبلغ المطلوب التبرع به" value={formatWesternAmount(donation.requestedAmount??donation.amount)}/>{donation.confirmedAmount!=null?<DetailRow label="المبلغ المستلم فعلياً" value={formatWesternAmount(donation.confirmedAmount)}/>:null}<DetailRow label="رقم الهاتف" value={donation.phone}/><DetailRow label="المدينة" value={localizeSyrianLocation(donation.city)}/>{donation.notes?<DetailRow label="ملاحظات" value={donation.notes}/>:null}{donation.cancelReason?<DetailRow label="سبب الإلغاء" value={donation.cancelReason} error/>:null}</Card>
      {donation.isAnonymous?<Card padding="md" className="gap-2 border-gray-200"><View className="flex-row-reverse items-center gap-2"><EyeOffIcon size={16} color="#6B7280"/><Text weight="semibold" size="sm">خصوصية التبرع</Text></View><Text size="2xs" className="text-gray-500">التبرع مجهول في العرض العام، لكن بيانات المتبرع متاحة لصاحب الحملة لإتمام العملية.</Text></Card>:null}
      <Card padding="md" className="gap-2 border-gray-200"><Text weight="semibold" size="sm">مسار الطلب</Text><TimelineRow label="تم إرسال طلب التبرع" date={donation.createdAt} active/><TimelineRow label="تم قبول طلب التبرع" date={donation.acceptedAt} active={Boolean(donation.acceptedAt)}/><TimelineRow label="تم بدء التواصل" date={donation.contactedAt} active={Boolean(donation.contactedAt)}/><TimelineRow label="تم الاتفاق" date={donation.agreedAt} active={Boolean(donation.agreedAt)}/><TimelineRow label="تم تأكيد استلام التبرع" date={donation.completedAt} active={Boolean(donation.completedAt)} success={Boolean(donation.completedAt)}/>{donation.cancelledAt?<TimelineRow label="تم إلغاء الطلب" date={donation.cancelledAt} active error/>:null}</Card>
      {donation.can&&Object.values(donation.can).some(Boolean)?<Card padding="md" className="gap-2 border-primary-400/20"><Text size="sm" weight="semibold">إدارة طلب التبرع</Text>{donation.can.accept?<Button fullWidth disabled={busy} onPress={()=>void run(()=>accept.mutateAsync({id:donation.id}),"تم قبول طلب التبرع.")}>قبول الطلب</Button>:null}{donation.can.contact?<Button fullWidth disabled={busy} onPress={()=>void run(()=>contact.mutateAsync({id:donation.id}),"تم تسجيل بدء التواصل.")}>بدء التواصل</Button>:null}{donation.can.agree?<Button fullWidth disabled={busy} onPress={()=>void run(()=>agree.mutateAsync({id:donation.id}),"تم تسجيل الاتفاق مع المتبرع.")}>تم الاتفاق</Button>:null}{donation.can.complete?<><Input fullWidth keyboardType="decimal-pad" value={confirmedAmount} onChangeText={setConfirmedAmount} placeholder="المبلغ الذي تم استلامه فعلياً" showStatusIcon={false}/><Button fullWidth disabled={busy||!(Number(confirmedAmount)>0)} onPress={()=>void run(()=>complete.mutateAsync({id:donation.id,confirmedAmount:Number(confirmedAmount)}),"تم تأكيد استلام التبرع واحتساب المبلغ في الحملة.")}>تأكيد استلام التبرع</Button></>:null}{donation.can.cancel?<Button fullWidth variant="tertiary" disabled={busy} onPress={()=>setCancelDialogOpen(true)}>إلغاء الطلب</Button>:null}</Card>:null}
      {donation.status==="completed"&&donation.flow!=="received"?<Button fullWidth onPress={()=>router.push({pathname:"/donate/[id]",params:{id:donation.campaignId}})}>إعادة التبرع</Button>:null}
    </>}
    <Dialog visible={cancelDialogOpen} title="إلغاء طلب التبرع" onClose={()=>{if(!cancel.isPending)setCancelDialogOpen(false)}} cancelable={!cancel.isPending}>
      <View className="gap-3"><Text size="xs" className="leading-6 text-gray-500">اكتب سبب الإلغاء قبل تأكيد إلغاء طلب التبرع.</Text><Input fullWidth multiline value={cancelReason} onChangeText={setCancelReason} placeholder="سبب الإلغاء" maxLength={1000} showStatusIcon={false}/><View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth variant="tertiary" disabled={cancel.isPending} onPress={()=>setCancelDialogOpen(false)}>رجوع</Button></View><View className="flex-1"><Button fullWidth loading={cancel.isPending} disabled={cancel.isPending||cancelReason.trim().length<3} onPress={()=>void handleCancel()}>تأكيد الإلغاء</Button></View></View></View>
    </Dialog>
  </Container>;
}
function DetailRow({label,value,error=false}:{label:string;value:string|null|undefined;error?:boolean}){return <View className="flex-row-reverse items-start justify-between gap-3 border-b border-gray-100 pb-2"><Text size="2xs" className="text-gray-500">{label}</Text><Text size="xs" className={error?"max-w-[65%] text-error-300":"max-w-[65%]"}>{value||"-"}</Text></View>}
function TimelineRow({label,date,active,success=false,error=false}:{label:string;date:string|null;active:boolean;success?:boolean;error?:boolean}){const stateClass=error?"text-error-300":success?"text-success-100":active?"text-primary-400":"text-gray-400";return <View className="flex-row-reverse items-start justify-between gap-3 py-1"><Text size="2xs" weight="medium" className={stateClass}>{active?"✓":"○"} {label}</Text><Text size="2xs" className="text-gray-400">{date?formatRelativeDateAr(date):""}</Text></View>}
