import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, RefreshControl, View, type NativeScrollEvent, type NativeSyntheticEvent, type ViewToken } from "react-native";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { useArticles } from "@/src/features/articles/queries";
import { usePublicMedia } from "@/src/features/media/queries";
import { useCampaigns, usePostsFeed } from "@/src/features/posts/queries";
import type { Campaign, ContentAudience, HomePost } from "@/src/features/posts/types";
import { getPrimaryColor } from "@/src/theme";
import { HomeBlogsSection } from "./HomeBlogsSection";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";
import { HomeReelsSection } from "./HomeReelsSection";
import { OrganizationCampaignCard } from "@/src/components/pages/profile/OrganizationCampaignCard";

type HomeFeedItem =
  | { kind: "post"; key: string; post: HomePost }
  | { kind: "campaign"; key: string; campaign: Campaign }
  | { kind: "reels"; key: string; occurrence: number }
  | { kind: "blogs"; key: string; occurrence: number };

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomGap(random: () => number) {
  return 3 + Math.floor(random() * 8);
}

function composeHomeFeed(posts: HomePost[], campaigns: Campaign[], seed: number): HomeFeedItem[] {
  const random = seededRandom(seed);
  const result: HomeFeedItem[] = [];
  let postsSinceModule = 0;
  let nextGap = randomGap(random);
  let reelsOccurrence = 0;
  let blogsOccurrence = 0;
  let campaignIndex = 0;
  let nextModule: "reels" | "blogs" = random() > 0.5 ? "reels" : "blogs";

  posts.forEach((post, index) => {
    result.push({ kind: "post", key: `post-${post.id}`, post });
    if ((index + 1) % 2 === 0 && campaigns[campaignIndex]) {
      const campaign = campaigns[campaignIndex++];
      result.push({ kind: "campaign", key: `campaign-${campaign.id}`, campaign });
    }
    postsSinceModule += 1;

    if (postsSinceModule < nextGap) return;

    if (nextModule === "reels") {
      result.push({
        kind: "reels",
        key: `reels-${reelsOccurrence}-${index}`,
        occurrence: reelsOccurrence,
      });
      reelsOccurrence += 1;
      nextModule = "blogs";
    } else {
      result.push({
        kind: "blogs",
        key: `blogs-${blogsOccurrence}-${index}`,
        occurrence: blogsOccurrence,
      });
      blogsOccurrence += 1;
      nextModule = "reels";
    }

    postsSinceModule = 0;
    nextGap = randomGap(random);
  });

  campaigns.slice(campaignIndex).forEach((campaign) => {
    result.push({ kind: "campaign", key: `campaign-${campaign.id}`, campaign });
  });

  if (reelsOccurrence === 0 && blogsOccurrence === 0 && result.length > 0) {
    result.unshift({ kind: "reels", key: "reels-0-fallback", occurrence: 0 });
    result.push({ kind: "blogs", key: "blogs-0-fallback", occurrence: 0 });
  } else if (reelsOccurrence === 0) {
    result.push({ kind: "reels", key: "reels-0-fallback", occurrence: 0 });
  } else if (blogsOccurrence === 0) {
    result.unshift({ kind: "blogs", key: "blogs-0-fallback", occurrence: 0 });
  }

  return result;
}

interface HomeFeedProps {
  /** Filters the posts feed by content audience. Omit to show everything
   * (used by the main Home tab); pass "student"/"general" for the Student
   * Hub's two tabs. Reels/blog interludes have no audience concept and stay
   * the same regardless — only the posts pool is filtered. */
  audience?: ContentAudience;
  listHeaderComponent?: React.ReactElement | null;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Called in addition to the feed's own refetch — e.g. to reset the
   * collapsible AppHeader on pull-to-refresh. */
  onRefresh?: () => void;
}

export function HomeFeed({ audience, listHeaderComponent, onScroll, onRefresh }: HomeFeedProps) {
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const [compositionSeed, setCompositionSeed] = useState(() => Math.floor(Math.random() * 2_000_000_000));
  const [activeReelsKey, setActiveReelsKey] = useState<string | null>(null);
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<HomeFeedItem>[] }) => {
    const visibleReels = viewableItems.find((entry) => entry.isViewable && entry.item.kind === "reels");
    setActiveReelsKey(visibleReels?.item.key ?? null);
  }, []);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 15 }).current;

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsFeed({ audience });
  const campaignsQuery = useCampaigns({ audience, status: "active", perPage: 10 });
  const articlesQuery = useArticles({ perPage: 20 });
  const mediaQuery = usePublicMedia({ perPage: 20 });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const campaigns = useMemo(() => campaignsQuery.data?.pages.flatMap((page) => page.items) ?? [], [campaignsQuery.data]);
  const articles = useMemo(
    () => articlesQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [articlesQuery.data],
  );
  const media = useMemo(
    () => mediaQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [mediaQuery.data],
  );
  const feed = useMemo(() => composeHomeFeed(posts, campaigns, compositionSeed), [campaigns, compositionSeed, posts]);

  const reelsModuleCount = useMemo(
    () => feed.filter((item) => item.kind === "reels").length,
    [feed],
  );
  const blogsModuleCount = useMemo(
    () => feed.filter((item) => item.kind === "blogs").length,
    [feed],
  );

  useEffect(() => {
    const required = reelsModuleCount * 5;
    if (required > media.length && mediaQuery.hasNextPage && !mediaQuery.isFetchingNextPage) {
      void mediaQuery.fetchNextPage();
    }
  }, [media.length, mediaQuery, reelsModuleCount]);

  useEffect(() => {
    const required = blogsModuleCount * 5;
    if (required > articles.length && articlesQuery.hasNextPage && !articlesQuery.isFetchingNextPage) {
      void articlesQuery.fetchNextPage();
    }
  }, [articles.length, articlesQuery, blogsModuleCount]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    if (campaignsQuery.hasNextPage && !campaignsQuery.isFetchingNextPage) void campaignsQuery.fetchNextPage();
  };

  const handleRefresh = () => {
    onRefresh?.();
    setCompositionSeed(Math.floor(Math.random() * 2_000_000_000));
    void Promise.all([refetch(), campaignsQuery.refetch(), articlesQuery.refetch(), mediaQuery.refetch()]);
  };

  if (isLoading && campaignsQuery.isLoading) {
    return (
      <View className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <HomePostCardSkeleton />
        <HomePostCardSkeleton />
        <HomePostCardSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-light-100 px-4 dark:bg-dark-300">
        <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">
          تعذر تحميل المنشورات. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.
        </Text>
        <Button size="small" onPress={() => void refetch()}>
          إعادة المحاولة
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <Animated.FlatList
        className="flex-1 px-4"
        data={feed}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.kind === "post") {
            return <HomePostCard post={item.post} enableAuthorNavigation />;
          }

          if (item.kind === "campaign") {
            return <OrganizationCampaignCard campaign={item.campaign} />;
          }

          if (item.kind === "reels") {
            const start = item.occurrence * 5;
            return (
              <HomeReelsSection
                items={media.slice(start, start + 5)}
                loading={mediaQuery.isLoading && media.length === 0}
                active={item.key === activeReelsKey}
              />
            );
          }

          const start = item.occurrence * 5;
          return (
            <HomeBlogsSection
              items={articles.slice(start, start + 5)}
              loading={articlesQuery.isLoading && articles.length === 0}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || campaignsQuery.isRefetching || articlesQuery.isRefetching || mediaQuery.isRefetching}
            onRefresh={handleRefresh}
            tintColor={primaryColor}
          />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              {audience === "student"
                ? "لا يوجد محتوى موجه للطلاب حالياً."
                : "لا توجد منشورات لعرضها حالياً."}
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage || campaignsQuery.isFetchingNextPage ? (
            <View className="py-2">
              <HomePostCardSkeleton />
            </View>
          ) : hasNextPage || campaignsQuery.hasNextPage ? (
            <View className="py-3" />
          ) : posts.length > 0 ? (
            <View className="items-center py-4">
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                تم عرض جميع المنشورات
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
