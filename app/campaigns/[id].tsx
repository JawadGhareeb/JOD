import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Text from "@/src/components/ui/Text";
import { useCampaign } from "@/src/features/posts/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const query = useCampaign(id);
  const campaign = query.data;
  if (query.isLoading) return <Container className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><Text>جارِ تحميل الحملة...</Text></Container>;
  if (!campaign || !id) return <Container className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><Text>تعذر العثور على الحملة.</Text></Container>;
  const progress = campaign.goalAmount > 0 ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100) : 0;
  return <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="gap-4"><Text variant="heading" weight="bold" rtlAlign="right">{campaign.title}</Text><Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400"><Text size="xs" className="text-gray-500 dark:text-gray-300">{campaign.organizationName || campaign.publisher.name}</Text><Text size="sm">{campaign.content || campaign.summary || ""}</Text></Card><Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400"><Text size="xs" weight="semibold">تقدم الحملة</Text><Text size="sm" className="text-primary-400">{campaign.raisedAmount.toLocaleString("ar-SY")} / {campaign.goalAmount.toLocaleString("ar-SY")}</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">{progress.toFixed(0)}% • {campaign.donorsCount} متبرع</Text></Card>{campaign.status === "active" ? <Button fullWidth onPress={() => { if (!requireAuth()) return; router.push({ pathname: "/donate/[id]", params: { id } }); }}>إرسال طلب تبرع</Button> : <Button fullWidth disabled>الحملة غير متاحة للتبرع</Button>}</View></Container>;
}
