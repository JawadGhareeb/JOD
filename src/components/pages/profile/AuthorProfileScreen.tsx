import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import { FollowButton } from "@/src/components/shared/FollowButton";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import { useAuthStatus } from "@/src/features/auth/queries";
import type { FollowTargetType } from "@/src/features/follows/types";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { HomePostCardSkeleton } from "@/src/components/pages/home/HomePostCardSkeleton";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Card from "@/src/components/ui/Card";
import Tabs from "@/src/components/ui/Tabs";
import Text from "@/src/components/ui/Text";
import { useOrganizationVideos } from "@/src/features/media/queries";
import type { PublicMediaItem } from "@/src/features/media/types";
import { useCampaigns, usePublisher, usePublisherPosts } from "@/src/features/posts/queries";
import type { Campaign, HomePost } from "@/src/features/posts/types";
import { getPrimaryColor } from "@/src/theme";
import { OrganizationCampaignCard } from "./OrganizationCampaignCard";
import { OrganizationVideoCard } from "./OrganizationVideoCard";

const BackIcon = appIcons.chevronRight;

type OrganizationProfileTab = "posts" | "campaigns" | "videos";
type ProfileListItem =
  | { kind: "post"; value: HomePost }
  | { kind: "campaign"; value: Campaign }
  | { kind: "video"; value: PublicMediaItem };

const ORGANIZATION_TABS = [
  { id: "posts", label: "المنشورات" },
  { id: "campaigns", label: "الحملات" },
  { id: "videos", label: "الفيديوهات" },
];

export function AuthorProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const authorId = Array.isArray(id) ? id[0] : id;
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const { user: currentUser } = useAuthStatus();
  const [activeTab, setActiveTab] = useState<OrganizationProfileTab>("posts");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const publisherQuery = usePublisher(authorId);
  const author = publisherQuery.data;
  const isOrganization = author?.publisherType === "organization";
  const followTargetType: FollowTargetType = isOrganization ? "organization" : "user";
  // Never offer to follow yourself — the backend rejects it with 422 anyway.
  const isOwnProfile = !isOrganization && Boolean(author && currentUser && author.id === currentUser.id);
  const canFollow = Boolean(author) && !isOwnProfile;

  const postsQuery = usePublisherPosts(authorId, { perPage: 20 });
  const campaignsQuery = useCampaigns(
    { organizationId: authorId, perPage: 20 },
    Boolean(authorId) && isOrganization && activeTab === "campaigns",
  );
  const videosQuery = useOrganizationVideos(
    authorId ?? "",
    { perPage: 20 },
    Boolean(authorId) && isOrganization && activeTab === "videos",
  );

  const posts = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [postsQuery.data],
  );
  const campaigns = useMemo(
    () => campaignsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [campaignsQuery.data],
  );
  const videos = useMemo(
    () => videosQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [videosQuery.data],
  );

  const totalLikes = useMemo(
    () => posts.reduce((sum, post) => sum + post.stats.likes, 0),
    [posts],
  );
  const listItems = useMemo<ProfileListItem[]>(() => {
    if (!isOrganization || activeTab === "posts") {
      return posts.map((value) => ({ kind: "post" as const, value }));
    }
    if (activeTab === "campaigns") {
      return campaigns.map((value) => ({ kind: "campaign" as const, value }));
    }
    return videos.map((value) => ({ kind: "video" as const, value }));
  }, [activeTab, campaigns, isOrganization, posts, videos]);

  const tabIsLoading = !isOrganization || activeTab === "posts"
    ? postsQuery.isLoading
    : activeTab === "campaigns"
      ? campaignsQuery.isLoading
      : videosQuery.isLoading;
  const tabIsError = !isOrganization || activeTab === "posts"
    ? postsQuery.isError
    : activeTab === "campaigns"
      ? campaignsQuery.isError
      : videosQuery.isError;
  const tabIsRefetching = !isOrganization || activeTab === "posts"
    ? postsQuery.isRefetching
    : activeTab === "campaigns"
      ? campaignsQuery.isRefetching
      : videosQuery.isRefetching;
  const tabIsFetchingNext = !isOrganization || activeTab === "posts"
    ? postsQuery.isFetchingNextPage
    : activeTab === "campaigns"
      ? campaignsQuery.isFetchingNextPage
      : videosQuery.isFetchingNextPage;

  const fetchNextActiveTab = () => {
    if (!isOrganization || activeTab === "posts") {
      if (postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) void postsQuery.fetchNextPage();
      return;
    }
    if (activeTab === "campaigns") {
      if (campaignsQuery.hasNextPage && !campaignsQuery.isFetchingNextPage) void campaignsQuery.fetchNextPage();
      return;
    }
    if (videosQuery.hasNextPage && !videosQuery.isFetchingNextPage) void videosQuery.fetchNextPage();
  };

  const refreshActiveTab = () => {
    void publisherQuery.refetch();
    if (!isOrganization || activeTab === "posts") {
      void postsQuery.refetch();
    } else if (activeTab === "campaigns") {
      void campaignsQuery.refetch();
    } else {
      void videosQuery.refetch();
    }
  };

  const isLoading = publisherQuery.isLoading || postsQuery.isLoading;

  if (isLoading) {
    return (
      <View className="flex-1 gap-3 bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <CardSkeleton height={170} margin={0} />
        <HomePostCardSkeleton />
        <HomePostCardSkeleton />
      </View>
    );
  }

  if (!author) {
    return (
      <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
        <View
          style={{ paddingTop: Math.max(insets.top, 8) }}
          className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
        >
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
            accessibilityRole="button"
            accessibilityLabel="رجوع"
          >
            <BackIcon size={20} color={primaryColor} strokeWidth={2.25} />
          </Pressable>
          <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
            ملف الناشر
          </Text>
          <View className="h-10 w-10" />
        </View>

        <View className="flex-1 items-center justify-center px-3">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            لم يتم العثور على الناشر
          </Text>
          <Text size="xs" className="mt-2 text-center leading-6 text-gray-500 dark:text-gray-300">
            هذا الحساب غير متوفر حالياً أو أن الرابط غير صحيح.
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/home")}
            className="mt-4 rounded-xl bg-primary-400 px-4 py-2"
            accessibilityRole="button"
            accessibilityLabel="العودة إلى الرئيسية"
          >
            <Text size="xs" weight="medium" className="text-light-50">
              العودة إلى الرئيسية
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-light-100 px-4 dark:bg-dark-300"
      contentContainerStyle={{ paddingBottom: 24 }}
      data={listItems}
      keyExtractor={(item) => `${item.kind}-${item.value.id}`}
      renderItem={({ item }) => {
        if (item.kind === "post") return <HomePostCard post={item.value} />;
        if (item.kind === "campaign") return <OrganizationCampaignCard campaign={item.value} />;
        return (
          <OrganizationVideoCard
            video={item.value}
            active={activeVideoId === item.value.id}
            onPlay={() => setActiveVideoId(item.value.id)}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={fetchNextActiveTab}
      onEndReachedThreshold={0.4}
      refreshing={publisherQuery.isRefetching || tabIsRefetching}
      onRefresh={refreshActiveTab}
      ListHeaderComponent={
        <View>
          <View
            style={{ paddingTop: Math.max(insets.top, 8) }}
            className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
          >
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
              accessibilityRole="button"
              accessibilityLabel="رجوع"
            >
              <BackIcon size={20} color={primaryColor} strokeWidth={2.25} />
            </Pressable>
            <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
              {isOrganization ? "ملف المنظمة" : "ملف الناشر"}
            </Text>
            <View className="h-10 w-10" />
          </View>

          <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-start gap-3">
              <Avatar name={author.name} imageUrl={author.avatarUrl} size={56} />
              <View className="flex-1">
                <View className="flex-row-reverse items-center gap-1">
                  <Text weight="semibold" size="base" className="text-dark-100 dark:text-light-50">
                    {author.name}
                  </Text>
                  {author.verified ? <VerifiedBadge /> : null}
                </View>
                <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  @{author.username}{author.city ? ` • ${author.city}` : ""}
                </Text>
                <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
                  {author.bio || "ينشر هذا الحساب محتوى إنساني وتحديثات عن الحملات المجتمعية."}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row-reverse justify-between gap-2 border-t border-gray-100 pt-3 dark:border-dark-400">
              <View className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
                <Text weight="semibold" size="sm" className="text-primary-400">{posts.length}</Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">المنشورات</Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
                <Text weight="semibold" size="sm" className="text-primary-400">{totalLikes}</Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">الإعجابات</Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
                <Text weight="semibold" size="sm" className="text-primary-400">{author.followersCount ?? 0}</Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">المتابعون</Text>
              </View>
            </View>

            {canFollow ? (
              <View className="mt-3">
                <FollowButton
                  targetType={followTargetType}
                  targetId={author.id}
                  isFollowing={Boolean(author.isFollowing)}
                  size="medium"
                  fullWidth
                />
              </View>
            ) : null}
          </Card>

          {isOrganization ? (
            <View className="mb-3">
              <Tabs
                tabs={ORGANIZATION_TABS}
                activeTab={activeTab}
                onTabChange={(tabId) => {
                  setActiveVideoId(null);
                  setActiveTab(tabId as OrganizationProfileTab);
                }}
              />
            </View>
          ) : (
            <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">
              منشورات الناشر
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        tabIsLoading ? (
          <View className="gap-3 pb-6">
            <CardSkeleton height={180} margin={0} />
            <CardSkeleton height={180} margin={0} />
          </View>
        ) : tabIsError ? (
          <View className="items-center py-8">
            <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
              تعذر تحميل هذا القسم حالياً. حاول مرة أخرى.
            </Text>
          </View>
        ) : (
          <View className="items-center py-8">
            <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
              {!isOrganization || activeTab === "posts"
                ? "لا توجد منشورات لهذا الناشر حالياً."
                : activeTab === "campaigns"
                  ? "لا توجد حملات لهذه المنظمة حالياً."
                  : "لا توجد فيديوهات لهذه المنظمة حالياً."}
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        tabIsFetchingNext ? (
          <View className="items-center py-4">
            <ActivityIndicator color={primaryColor} />
          </View>
        ) : null
      }
    />
  );
}
