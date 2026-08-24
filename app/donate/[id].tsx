import { useLocalSearchParams, useRouter } from "expo-router";
import { HeartHandshake } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { useDonateToCampaign } from "@/src/features/donations/queries";
import type { ContactMethod, PaymentMethod } from "@/src/features/donations/types";
import { useCampaign } from "@/src/features/posts/queries";
import { useAuthStatus } from "@/src/features/auth/queries";
import { ApiClientError } from "@/src/lib/api-client";

const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: "phone", label: "اتصال" },
  { value: "whatsapp", label: "واتساب" },
  { value: "email", label: "بريد إلكتروني" },
  { value: "other", label: "أخرى" },
];
const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "تحويل بنكي" },
  { value: "cash", label: "نقدي" },
  { value: "other", label: "أخرى" },
];

export default function DonatePage() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const campaignId = Array.isArray(id) ? id[0] : id;
  const campaignQuery = useCampaign(campaignId);
  const donateMutation = useDonateToCampaign();
  const { user } = useAuthStatus();
  const [amount, setAmount] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("whatsapp");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [notes, setNotes] = useState("");
  const campaign = campaignQuery.data;
  const amountNumber = Number(amount);
  const validAmount = Number.isFinite(amountNumber) && amountNumber >= 0.01 && amountNumber <= 999999999.99;

  const submit = async () => {
    if (!requireAuth() || !campaignId || !validAmount) return;
    try {
      await donateMutation.mutateAsync({
        campaignId,
        input: {
          amount: amountNumber,
          contactMethod,
          paymentMethod,
          phone: phone.trim() || null,
          city: city.trim() || null,
          notes: notes.trim() || null,
        },
      });
      toast.success("تم إرسال طلب التبرع. بانتظار تواصل المنظمة معك.", "تم إرسال الطلب");
      router.replace("/my-donations");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "حدث خطأ غير متوقع.", "تعذر إرسال طلب التبرع");
    }
  };

  return (
    <KeyboardAvoider className="flex-1">
      <Container scrollable className="bg-light-100 dark:bg-dark-300" scrollViewProps={{ contentContainerStyle: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 36 } }}>
        <View className="gap-5">
          <View className="items-center gap-3"><Logo variant="medium" showName /><Text variant="heading" weight="bold" rtlAlign="center">طلب تبرع</Text></View>
          {campaignQuery.isLoading ? <Text size="sm" color="secondary" rtlAlign="center">جارِ تحميل الحملة...</Text> : !campaign ? <Card padding="md"><Text size="sm" rtlAlign="center">تعذر العثور على الحملة المطلوبة.</Text></Card> : (
            <>
              <Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400">
                <Text weight="semibold" size="sm">{campaign.title}</Text>
                <Text size="xs" className="text-gray-500 dark:text-gray-300">{campaign.organizationName || campaign.publisher.name}</Text>
                <Text size="xs" className="text-gray-500 dark:text-gray-300">تم جمع {campaign.raisedAmount.toLocaleString("ar-SY")} من {campaign.goalAmount.toLocaleString("ar-SY")}</Text>
              </Card>
              <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
                <View className="flex-row-reverse items-center gap-2"><HeartHandshake size={20} color="#405d72" /><Text weight="semibold" size="sm">بيانات طلب التبرع</Text></View>
                <Input fullWidth showStatusIcon={false} value={amount} onChangeText={setAmount} placeholder="المبلغ" keyboardType="decimal-pad" />
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">طريقة التواصل</Text>
                <View className="flex-row-reverse flex-wrap gap-2">{CONTACT_METHODS.map((method) => <Pressable key={method.value} onPress={() => setContactMethod(method.value)} className={`rounded-xl border px-3 py-2 ${contactMethod === method.value ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}><Text size="2xs" className={contactMethod === method.value ? "text-primary-400" : "text-gray-600 dark:text-gray-200"}>{method.label}</Text></Pressable>)}</View>
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">طريقة الدفع المتفق عليها لاحقاً</Text>
                <View className="flex-row-reverse flex-wrap gap-2">{PAYMENT_METHODS.map((method) => <Pressable key={method.value} onPress={() => setPaymentMethod(method.value)} className={`rounded-xl border px-3 py-2 ${paymentMethod === method.value ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}><Text size="2xs" className={paymentMethod === method.value ? "text-primary-400" : "text-gray-600 dark:text-gray-200"}>{method.label}</Text></Pressable>)}</View>
                <Input fullWidth showStatusIcon={false} value={phone} onChangeText={setPhone} placeholder="رقم الهاتف - اختياري" keyboardType="phone-pad" />
                <Input fullWidth showStatusIcon={false} value={city} onChangeText={setCity} placeholder="المدينة - اختياري" />
                <Input fullWidth showStatusIcon={false} multiline value={notes} onChangeText={setNotes} placeholder="ملاحظات للمنظمة - اختياري" maxLength={2000} />
                {!validAmount && amount.length ? <Text size="2xs" className="text-error-300">أدخل مبلغاً صالحاً يبدأ من 0.01.</Text> : null}
                <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">هذا طلب تبرع وليس عملية دفع مكتملة. يتم احتساب المبلغ ضمن الحملة فقط بعد تأكيد المنظمة استلامه.</Text>
                <Button fullWidth loading={donateMutation.isPending} disabled={!validAmount || donateMutation.isPending || campaign.status !== "active"} onPress={() => void submit()}>إرسال طلب التبرع</Button>
              </Card>
            </>
          )}
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
