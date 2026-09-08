import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RefreshControl, View } from "react-native";
import { useColorScheme } from "nativewind";
import Button from "@/src/components/ui/Button";
import Container from "@/src/components/ui/Container";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Tabs from "@/src/components/ui/Tabs";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useGroup, useGroupPosts, useGroupRecommendations } from "@/src/features/groups/queries";
import type { GroupPostStatus, GroupProfile } from "@/src/features/groups/types";
import { getPrimaryColor } from "@/src/theme";
import { GroupAboutSection } from "./GroupAboutSection";
import { GroupPostCard } from "./GroupPostCard";
import { GroupProfileHeader } from "./GroupProfileHeader";
import { GroupRecommendationCard } from "./GroupRecommendationCard";

type GroupProfileTab = "published" | "pending" | "rejected" | "about" | "recommended";

export function GroupProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const groupId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const groupQuery = useGroup(groupId);
  const [activeTab, setActiveTab] = useState<GroupProfileTab>("published");
  const group = groupQuery.data ?? null;

  if (groupQuery.isLoading) return <GroupProfileSkeleton />;
  if (!group) return <GroupNotFound />;

  const tabs = group.isOwner
    ? [
        { id: "published", label: "المنشورة" },
        { id: "pending", label: "قيد المراجعة" },
        { id: "rejected", label: "المرفوضة" },
        { id: "about", label: "عن الفريق" },
      ]
    : [
        { id: "published", label: "المنشورات" },
        { id: "about", label: "نبذة" },
        { id: "recommended", label: "مقترح لك" },
      ];

  return (
    <Container scrollable scrollViewProps={{ contentContainerStyle: { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 16, gap: 12 }, refreshControl: <RefreshControl refreshing={groupQuery.isRefetching} onRefresh={() => void groupQuery.refetch()} tintColor={primaryColor} /> }}>
      <MenuPageHeader title="الفريق التطوعي" />
      <GroupProfileHeader group={group} />
      {group.status === "active" && group.isOwner ? <View className="gap-2"><View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth size="small" onPress={() => router.push({ pathname: "/create-post", params: { groupId: group.id } })}>نشر بوست</Button></View><View className="flex-1"><Button fullWidth size="small" variant="tertiary" onPress={() => router.push({ pathname: "/groups/[id]/campaign-create" as never, params: { id: group.id } } as never)}>إنشاء حملة</Button></View></View><View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth size="small" variant="tertiary" onPress={() => router.push({ pathname: "/groups/[id]/edit" as never, params: { id: group.id } } as never)}>تعديل الفريق</Button></View><View className="flex-1"><Button fullWidth size="small" variant="tertiary" onPress={() => router.push({ pathname: "/groups/[id]/settings" as never, params: { id: group.id } } as never)}>الإعدادات</Button></View></View></View> : null}
      {group.status === "active" && group.canCreatePost && !group.isOwner ? <Button fullWidth size="small" onPress={() => router.push({ pathname: "/create-post", params: { groupId: group.id } })}>نشر في الفريق</Button> : null}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as GroupProfileTab)} />
      <GroupProfileTabBody group={group} activeTab={activeTab} />
    </Container>
  );
}

function GroupProfileTabBody({ group, activeTab }: { readonly group: GroupProfile; readonly activeTab: GroupProfileTab }) {
  if (group.status !== "active") return <GroupAboutSection group={group} />;
  if (activeTab === "about") return <GroupAboutSection group={group} />;
  if (activeTab === "recommended") return <GroupRecommendationsTab groupId={group.id} />;
  return <GroupPostsTab group={group} status={activeTab as GroupPostStatus} />;
}

function GroupPostsTab({ group, status }: { readonly group: GroupProfile; readonly status: GroupPostStatus }) {
  const postsQuery = useGroupPosts(group.id, status);
  if (postsQuery.isLoading) return <ListSkeleton height={140} />;
  const posts = postsQuery.data ?? [];
  if (posts.length === 0) return <EmptyNotice message={status === "pending" ? "لا توجد منشورات بانتظار مراجعتك." : status === "rejected" ? "لا توجد منشورات مرفوضة." : "لا توجد منشورات في هذا الفريق بعد."} />;
  return <View className="gap-3">{posts.map((post) => <GroupPostCard key={post.id} post={post} canManage={Boolean(group.isOwner)} />)}</View>;
}

function GroupRecommendationsTab({ groupId }: { readonly groupId: string }) {
  const recommendationsQuery = useGroupRecommendations(groupId);
  if (recommendationsQuery.isLoading) return <ListSkeleton height={120} />;
  const recommendations = recommendationsQuery.data ?? [];
  if (recommendations.length === 0) return <EmptyNotice message="لا توجد اقتراحات مرتبطة بمجال هذا الفريق حالياً." />;
  return <View className="gap-3">{recommendations.map((recommendation) => <GroupRecommendationCard key={recommendation.id} recommendation={recommendation} />)}</View>;
}

function EmptyNotice({ message }: { readonly message: string }) { return <View className="items-center py-12"><Text size="xs" rtlAlign="center" className="text-gray-500 dark:text-gray-300">{message}</Text></View>; }
function ListSkeleton({ height }: { readonly height: number }) { return <View className="gap-3">{[0, 1, 2].map((key) => <CardSkeleton key={key} height={height} margin={0} />)}</View>; }
function GroupProfileSkeleton() { return <Container className="px-4"><MenuPageHeader title="الفريق التطوعي" /><View className="gap-3"><CardSkeleton height={280} margin={0} /><CardSkeleton height={140} margin={0} /></View></Container>; }
function GroupNotFound() { return <Container className="px-4"><MenuPageHeader title="الفريق التطوعي" /><View className="items-center py-16"><Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">لم نعثر على هذا الفريق. قد يكون حُذف أو لم يعد متاحاً.</Text></View></Container>; }
