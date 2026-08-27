import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useCreateHelpOffer } from "@/src/features/help-offers/queries";
import type { HelpContactMethod, HelpType } from "@/src/features/help-offers/types";
import { usePost } from "@/src/features/posts/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";

const types: { value: HelpType; label: string }[] = [{ value: "financial", label: "مالية" }, { value: "supplies", label: "مستلزمات" }, { value: "service", label: "خدمة" }, { value: "transportation", label: "نقل" }, { value: "medicine", label: "دواء" }, { value: "food", label: "غذاء" }, { value: "other", label: "أخرى" }];
const contacts: { value: HelpContactMethod; label: string }[] = [{ value: "phone", label: "اتصال" }, { value: "whatsapp", label: "واتساب" }, { value: "email", label: "بريد" }, { value: "other", label: "أخرى" }];

export default function CreateHelpOfferPage() {
  const router = useRouter(); const toast = useToast(); const { requireAuth } = useAuthGuard(); const { user } = useAuthStatus();
  const { postId: raw } = useLocalSearchParams<{ postId?: string | string[] }>(); const postId = Array.isArray(raw) ? raw[0] : raw;
  const postQuery = usePost(postId); const mutation = useCreateHelpOffer();
  const [type, setType] = useState<HelpType>("financial"); const [amount, setAmount] = useState(""); const [description, setDescription] = useState(""); const [contactMethod, setContactMethod] = useState<HelpContactMethod>("whatsapp"); const [phone, setPhone] = useState(user?.phone ?? "");
  const amountNumber = Number(amount); const valid = type !== "financial" || (Number.isFinite(amountNumber) && amountNumber >= 0.01);
  const submit = async () => { if (!requireAuth() || !postId || !valid) return; try { const offer = await mutation.mutateAsync({ postId, input: { type, amount: type === "financial" ? amountNumber : undefined, description: description.trim() || null, contactMethod, phone: phone.trim() || null } }); toast.success("تم إرسال عرض المساعدة لصاحب الطلب.", "تم إرسال العرض"); router.replace({ pathname: "/help-offers/[id]", params: { id: offer.id } }); } catch (error) { toast.error(error instanceof ApiClientError ? error.message : "تعذر إرسال عرض المساعدة."); void postQuery.refetch(); } };
  return <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="gap-4"><Text variant="heading" weight="bold" rtlAlign="right">تقديم مساعدة</Text><Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400"><Text weight="semibold" size="sm">{postQuery.data?.title || "طلب المساعدة"}</Text><Text size="xs" className="text-gray-500 dark:text-gray-300">اختر نوع المساعدة وأرسل معلومات التواصل الخاصة بالعرض.</Text></Card><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="xs" weight="semibold">نوع المساعدة</Text><View className="flex-row-reverse flex-wrap gap-2">{types.map((item) => <Pressable key={item.value} onPress={() => setType(item.value)} className={`rounded-full border px-3 py-2 ${type === item.value ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}><Text size="2xs" className={type === item.value ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}>{item.label}</Text></Pressable>)}</View>{type === "financial" ? <Input fullWidth value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="المبلغ" showStatusIcon={false} /> : null}<Input fullWidth multiline value={description} onChangeText={setDescription} placeholder="وصف المساعدة - اختياري" maxLength={3000} showStatusIcon={false} /><Text size="xs" weight="semibold">طريقة التواصل</Text><View className="flex-row-reverse flex-wrap gap-2">{contacts.map((item) => <Pressable key={item.value} onPress={() => setContactMethod(item.value)} className={`rounded-full border px-3 py-2 ${contactMethod === item.value ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}><Text size="2xs" className={contactMethod === item.value ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}>{item.label}</Text></Pressable>)}</View><Input fullWidth value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="رقم الهاتف - اختياري" showStatusIcon={false} /><Text size="2xs" className="text-gray-500 dark:text-gray-300">بيانات التواصل خاصة بالعرض ولا تظهر كبيانات عامة على المنشور.</Text><Button fullWidth loading={mutation.isPending} disabled={!valid || mutation.isPending || postQuery.data?.canOfferHelp === false} onPress={() => void submit()}>إرسال عرض المساعدة</Button></Card></View></Container>;
}
