import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, RefreshControl, View, type NativeScrollEvent, type NativeSyntheticEvent, type ViewToken } from "react-native";
import { OrganizationCampaignCard } from "@/src/components/pages/profile/OrganizationCampaignCard";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { useArticles } from "@/src/features/articles/queries";
import { useAuthStatus } from "@/src/features/auth/queries";
import { usePublicMedia } from "@/src/features/media/queries";
import type { PublicMediaItem } from "@/src/features/media/types";
import { usePersonalizedFeed } from "@/src/features/personalization/queries";
import type { PersonalizedFeedItem, PersonalizedFeedType } from "@/src/features/personalization/types";
import { useCampaigns, usePostsFeed } from "@/src/features/posts/queries";
import type { Campaign, ContentAudience, HomePost } from "@/src/features/posts/types";
import { getPrimaryColor } from "@/src/theme";
import { HomeBlogsSection } from "./HomeBlogsSection";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";
import { HomeReelsSection } from "./HomeReelsSection";

type HomeFeedItem =
  | { kind: "post"; key: string; post: HomePost }
  | { kind: "campaign"; key: string; campaign: Campaign }
  | { kind: "reel"; key: string; video: PublicMediaItem }
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
      result.push({ kind: "reels", key: `reels-${reelsOccurrence}-${index}`, occurrence: reelsOccurrence });
      reelsOccurrence += 1;
      nextModule = "blogs";
    } else {
      result.push({ kind: "blogs", key: `blogs-${blogsOccurrence}-${index}`, occurrence: blogsOccurrence });
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

function composeFollowingFeed(items: PersonalizedFeedItem[]): HomeFeedItem[] {
  return items.flatMap<HomeFeedItem>((item, index) => {
    if (item.contentType === "post") {
      const post = { ...(item.content as HomePost), recommendation: item.recommendation };
      return [{ kind: "post", key: `following-post-${post.id}-${index}`, post }];
    }

    if (item.contentType === "campaign") {
      const campaign = { ...(item.content as Campaign), recommendation: item.recommendation };
      return [{ kind: "campaign", key: `following-campaign-${campaign.id}-${index}`, campaign }];
    }

    if (item.contentType === "video" || item.contentType === "media") {
      const video = { ...(item.content as PublicMediaItem), recommendation: item.recommendation };
      return [{ kind: "reel", key: `following-reel-${video.id}-${index}`, video }];
    }

    return [];
  });
}

interface HomeFeedProps {
  audience?: ContentAudience;
  feedType?: PersonalizedFeedType;
  listHeaderComponent?: React.ReactElement | null;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onRefresh?: () => void;
}

export function HomeFeed({ audience, feedType = "for_you", listHeaderComponent, onScroll, onRefresh }: HomeFeedProps) {
  const { colorScheme } = useColorScheme();
  const { isAuthenticated } = useAuthStatus();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const usePersonalized = !audience && isAuthenticated;
  const [compositionSeed, setCompositionSeed] = useState(() => Math.floor(Math.random() * 2_000_000_000));
  const [activeReelsKey, setActiveReelsKey] = useState<string | null>(null);
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<HomeFeedItem>[] }) => {
    const visibleReels = viewableItems.find((entry) => entry.isViewable && (entry.item.kind === "reels" || entry.item.kind === "reel"));
    setActiveReelsKey(visibleReels?.item.key ?? null);
  }, []);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 15 }).current;

  const discoveryQuery = usePostsFeed({ audience }, !usePersonalized);
  const personalizedQuery = usePersonalizedFeed(feedType, usePersonalized);
  const useFollowingComposition = usePersonalized && feedType === "following";
  const campaignsQuery = useCampaigns({ audience, status: "active", perPage: 10 }, !useFollowingComposition);
  const articlesQuery = useArticles({ perPage: 20 });
  const mediaQuery = usePublicMedia({ perPage: 20 });

  const personalizedItems = useMemo(
    () => personalizedQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [personalizedQuery.data],
  );
  const posts = useMemo<HomePost[]>(() => {
    if (!usePersonalized) return discoveryQuery.data?.pages.flatMap((page) => page.items) ?? [];
    return personalizedItems
      .filter((item) => item.contentType === "post")
      .map((item) => ({ ...(item.content as HomePost), recommendation: item.recommendation }));
  }, [discoveryQuery.data, personalizedItems, usePersonalized]);
  const campaigns = useMemo<Campaign[]>(() => {
    if (useFollowingComposition) {
      return personalizedItems
        .filter((item) => item.contentType === "campaign")
        .map((item) => ({ ...(item.content as Campaign), recommendation: item.recommendation }));
    }
    return campaignsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  }, [campaignsQuery.data, personalizedItems, useFollowingComposition]);
  const articles = useMemo(() => articlesQuery.data?.pages.flatMap((page) => page.items) ?? [], [articlesQuery.data]);
  const media = useMemo(() => mediaQuery.data?.pages.flatMap((page) => page.items) ?? [], [mediaQuery.data]);
  const feed = useMemo(
    () => useFollowingComposition ? composeFollowingFeed(personalizedItems) : composeHomeFeed(posts, campaigns, compositionSeed),
    [campaigns, compositionSeed, personalizedItems, posts, useFollowingComposition],
  );

  const contentIsLoading = usePersonalized ? personalizedQuery.isLoading : discoveryQuery.isLoading;
  const contentIsError = usePersonalized ? personalizedQuery.isError : discoveryQuery.isError;
  const contentIsRefetching = usePersonalized ? personalizedQuery.isRefetching : discoveryQuery.isRefetching;
  const contentHasNextPage = usePersonalized ? personalizedQuery.hasNextPage : discoveryQuery.hasNextPage;
  const contentIsFetchingNextPage = usePersonalized ? personalizedQuery.isFetchingNextPage : discoveryQuery.isFetchingNextPage;

  const reelsModuleCount = useMemo(() => feed.filter((item) => item.kind === "reels").length, [feed]);
  const blogsModuleCount = useMemo(() => feed.filter((item) => item.kind === "blogs").length, [feed]);

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

  const refetchContent = () => usePersonalized ? personalizedQuery.refetch() : discoveryQuery.refetch();

  const handleLoadMore = () => {
    if (contentHasNextPage && !contentIsFetchingNextPage) {
      if (usePersonalized) void personalizedQuery.fetchNextPage();
      else void discoveryQuery.fetchNextPage();
    }
    if (!useFollowingComposition && campaignsQuery.hasNextPage && !campaignsQuery.isFetchingNextPage) void campaignsQuery.fetchNextPage();
  };

  const handleRefresh = () => {
    onRefresh?.();
    setCompositionSeed(Math.floor(Math.random() * 2_000_000_000));
    void Promise.all([
      refetchContent(),
      useFollowingComposition ? Promise.resolve() : campaignsQuery.refetch(),
      articlesQuery.refetch(),
      mediaQuery.refetch(),
    ]);
  };

  if (contentIsLoading && (usePersonalized || campaignsQuery.isLoading)) {
    return (
      <View className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <HomePostCardSkeleton />
        <HomePostCardSkeleton />
        <HomePostCardSkeleton />
      </View>
    );
  }

  if (contentIsError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-light-100 px-4 dark:bg-dark-300">
        <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">
          تعذر تحميل المحتوى. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.
        </Text>
        <Button size="small" onPress={() => void refetchContent()}>
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
          if (item.kind === "post") return <HomePostCard post={item.post} enableAuthorNavigation />;
          if (item.kind === "campaign") return <OrganizationCampaignCard campaign={item.campaign} />;

          if (item.kind === "reel") {
            return <HomeReelsSection items={[item.video]} active={item.key === activeReelsKey} />;
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
          return <HomeBlogsSection items={articles.slice(start, start + 5)} loading={articlesQuery.isLoading && articles.length === 0} />;
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
            refreshing={contentIsRefetching || (!useFollowingComposition && campaignsQuery.isRefetching) || articlesQuery.isRefetching || mediaQuery.isRefetching}
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
                : usePersonalized && feedType === "following"
                  ? "لا يوجد محتوى جديد من الجهات التي تتابعها."
                  : usePersonalized && feedType === "nearby"
                    ? "لا يوجد محتوى قريب من موقعك المفضل حالياً."
                    : usePersonalized && feedType === "urgent"
                      ? "لا توجد طلبات عاجلة حالياً."
                      : "لا توجد منشورات لعرضها حالياً."}
            </Text>
          </View>
        }
        ListFooterComponent={
          contentIsFetchingNextPage || (!useFollowingComposition && campaignsQuery.isFetchingNextPage) ? (
            <View className="py-2"><HomePostCardSkeleton /></View>
          ) : contentHasNextPage || (!useFollowingComposition && campaignsQuery.hasNextPage) ? (
            <View className="py-3" />
          ) : feed.length > 0 ? (
            <View className="items-center py-4">
              <Text size="xs" className="text-gray-500 dark:text-gray-300">تم عرض جميع المحتويات</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
