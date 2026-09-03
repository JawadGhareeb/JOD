import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { RefreshControl, View } from "react-native";
import { useColorScheme } from "nativewind";
import Container from "@/src/components/ui/Container";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Tabs from "@/src/components/ui/Tabs";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import {
  useGroup,
  useGroupPosts,
  useGroupRecommendations,
} from "@/src/features/groups/queries";
import type { GroupProfile } from "@/src/features/groups/types";
import { getPrimaryColor } from "@/src/theme";
import { GroupAboutSection } from "./GroupAboutSection";
import { GroupPostCard } from "./GroupPostCard";
import { GroupProfileHeader } from "./GroupProfileHeader";
import { GroupRecommendationCard } from "./GroupRecommendationCard";

type GroupProfileTab = "posts" | "about" | "recommended";

const PROFILE_TABS = [
  { id: "posts", label: "المنشورات" },
  { id: "about", label: "نبذة" },
  { id: "recommended", label: "مقترح لك" },
];

export function GroupProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const groupId = Array.isArray(id) ? id[0] : id;
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  const groupQuery = useGroup(groupId);
  const [activeTab, setActiveTab] = useState<GroupProfileTab>("posts");
  const group = groupQuery.data ?? null;

  if (groupQuery.isLoading) return <GroupProfileSkeleton />;
  if (!group) return <GroupNotFound />;

  return (
    <Container
      scrollable
      scrollViewProps={{
        contentContainerStyle: { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 16, gap: 12 },
        refreshControl: (
          <RefreshControl
            refreshing={groupQuery.isRefetching}
            onRefresh={() => groupQuery.refetch()}
            tintColor={primaryColor}
          />
        ),
      }}
    >
      <MenuPageHeader title="الفريق التطوعي" />
      <GroupProfileHeader group={group} />
      <Tabs
        tabs={PROFILE_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as GroupProfileTab)}
      />
      <GroupProfileTabBody group={group} activeTab={activeTab} />
    </Container>
  );
}

function GroupProfileTabBody({
  group,
  activeTab,
}: {
  readonly group: GroupProfile;
  readonly activeTab: GroupProfileTab;
}) {
  if (group.status !== "active") return <GroupAboutSection group={group} />;
  if (activeTab === "about") return <GroupAboutSection group={group} />;
  if (activeTab === "posts") return <GroupPostsTab groupId={group.id} />;
  return <GroupRecommendationsTab groupId={group.id} />;
}

function GroupPostsTab({ groupId }: { readonly groupId: string }) {
  const postsQuery = useGroupPosts(groupId);

  if (postsQuery.isLoading) return <ListSkeleton height={140} />;

  const posts = postsQuery.data ?? [];
  if (posts.length === 0) {
    return <EmptyNotice message="لا توجد منشورات في هذه المجموعة بعد." />;
  }

  return (
    <View>
      {posts.map((post) => (
        <GroupPostCard key={post.id} post={post} />
      ))}
    </View>
  );
}

function GroupRecommendationsTab({ groupId }: { readonly groupId: string }) {
  const recommendationsQuery = useGroupRecommendations(groupId);

  if (recommendationsQuery.isLoading) return <ListSkeleton height={120} />;

  const recommendations = recommendationsQuery.data ?? [];
  if (recommendations.length === 0) {
    return <EmptyNotice message="لا توجد اقتراحات مرتبطة بمجال هذه المجموعة حالياً." />;
  }

  return (
    <View>
      <Text size="2xs" className="mb-2 text-gray-500 dark:text-gray-300">
        مقترحات مبنية على مجال المجموعة ومحافظتها
      </Text>
      {recommendations.map((recommendation) => (
        <GroupRecommendationCard key={recommendation.id} recommendation={recommendation} />
      ))}
    </View>
  );
}

function EmptyNotice({ message }: { readonly message: string }) {
  return (
    <View className="items-center py-12">
      <Text size="xs" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
        {message}
      </Text>
    </View>
  );
}

function ListSkeleton({ height }: { readonly height: number }) {
  return (
    <View className="gap-3">
      {[0, 1, 2].map((key) => (
        <CardSkeleton key={key} height={height} margin={0} />
      ))}
    </View>
  );
}

function GroupProfileSkeleton() {
  return (
    <Container className="px-4">
      <MenuPageHeader title="الفريق التطوعي" />
      <View className="gap-3">
        <CardSkeleton height={280} margin={0} />
        <CardSkeleton height={140} margin={0} />
      </View>
    </Container>
  );
}

function GroupNotFound() {
  return (
    <Container className="px-4">
      <MenuPageHeader title="الفريق التطوعي" />
      <View className="items-center py-16">
        <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
          لم نعثر على هذه المجموعة. قد تكون حُذفت أو لم تعد متاحة.
        </Text>
      </View>
    </Container>
  );
}
