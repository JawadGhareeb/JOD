import { useLocalSearchParams, useRouter } from "expo-router";
import { BriefcaseBusiness, MapPin } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { useCities } from "@/src/features/lookups/queries";
import { useApplyToCampaign } from "@/src/features/applications/queries";
import { useCampaign } from "@/src/features/posts/queries";
import { useAuthStatus } from "@/src/features/auth/queries";
import { ApiClientError } from "@/src/lib/api-client";

export default function ApplyPage() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const campaignId = Array.isArray(id) ? id[0] : id;
  const campaignQuery = useCampaign(campaignId);
  const applyMutation = useApplyToCampaign();
  const { user } = useAuthStatus();
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const citiesQuery = useCities();
  const cityOptions: SelectionOption[] = useMemo(
    () => (citiesQuery.data ?? []).map((item) => ({ label: item.name, value: item.name })),
    [citiesQuery.data],
  );
  const campaign = campaignQuery.data;

  const submit = async () => {
    if (!requireAuth()) return;
    if (!campaignId) return;
    try {
      await applyMutation.mutateAsync({ campaignId, input: { phone: phone.trim() || null, city: city.trim() || null } });
      toast.success("تم تسجيل طلبك على الحملة بنجاح.", "تم إرسال الطلب");
      router.back();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "حدث خطأ غير متوقع.", "تعذر إرسال الطلب");
    }
  };

  return (
    <KeyboardAvoider className="flex-1">
      <Container scrollable className="bg-light-100 dark:bg-dark-300" scrollViewProps={{ contentContainerStyle: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 36 } }}>
        <View className="gap-5">
          <View className="items-center gap-3"><Logo variant="medium" showName /><Text variant="heading" weight="bold" rtlAlign="center">التقديم على الحملة</Text></View>
          {campaignQuery.isLoading ? <Text size="sm" color="secondary" rtlAlign="center">جارِ تحميل الحملة...</Text> : !campaign ? <Card padding="md"><Text size="sm" rtlAlign="center">تعذر العثور على الحملة المطلوبة.</Text></Card> : (
            <>
              <Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400">
                <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">{campaign.title}</Text>
                <Text size="xs" className="text-gray-500 dark:text-gray-300">{campaign.organizationName || campaign.publisher.name}{campaign.location ? ` • ${campaign.location}` : ""}</Text>
                <Text size="xs" className="leading-6 text-gray-600 dark:text-gray-200">{campaign.summary || campaign.content}</Text>
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">عدد المتقدمين الحالي: {campaign.applicantsCount}</Text>
              </Card>
              <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
                <View className="flex-row-reverse items-center gap-2"><BriefcaseBusiness size={20} color="#4A9782" /><Text weight="semibold" size="sm">بيانات التواصل</Text></View>
                <Input fullWidth showStatusIcon={false} value={phone} onChangeText={setPhone} placeholder="رقم الهاتف - اختياري" keyboardType="phone-pad" />
                <Pressable onPress={() => setIsCityModalOpen(true)} accessibilityRole="button" accessibilityLabel="اختر المحافظة"><View pointerEvents="none"><Input fullWidth editable={false} showStatusIcon={false} rightIcon={<MapPin size={16} strokeWidth={2.25} />} value={city} placeholder="اختر المحافظة - اختياري" placeholderTextColor="#9CA3AF" /></View></Pressable>
                <Button fullWidth loading={applyMutation.isPending} disabled={applyMutation.isPending || campaign.status !== "active"} onPress={() => void submit()}>{campaign.status === "active" ? "إرسال طلب التقديم" : "الحملة غير متاحة للتقديم"}</Button>
              </Card>
            </>
          )}
        </View>
      </Container>
      <SelectionModal visible={isCityModalOpen} title="اختر المحافظة السورية" options={cityOptions} selectedValue={city} onSelect={(value) => { setCity(value); setIsCityModalOpen(false); }} onClose={() => setIsCityModalOpen(false)} />
    </KeyboardAvoider>
  );
}
