import { useEffect, useMemo, useState } from "react";
import { Animated, RefreshControl, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { useArticles } from "@/src/features/articles/queries";
import { usePublicMedia } from "@/src/features/media/queries";
import { usePostsFeed } from "@/src/features/posts/queries";
import type { HomePost } from "@/src/features/posts/types";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { HomeBlogsSection } from "./HomeBlogsSection";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";
import { HomeReelsSection } from "./HomeReelsSection";

type HomeFeedItem =
  | { kind: "post"; key: string; post: HomePost }
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

function composeHomeFeed(posts: HomePost[], seed: number): HomeFeedItem[] {
  const random = seededRandom(seed);
  const result: HomeFeedItem[] = [];
  let postsSinceModule = 0;
  let nextGap = randomGap(random);
  let reelsOccurrence = 0;
  let blogsOccurrence = 0;

  posts.forEach((post, index) => {
    result.push({ kind: "post", key: `post-${post.id}`, post });
    postsSinceModule += 1;

    if (postsSinceModule < nextGap) return;

    if (random() < 0.5) {
      result.push({
        kind: "reels",
        key: `reels-${reelsOccurrence}-${index}`,
        occurrence: reelsOccurrence,
      });
      reelsOccurrence += 1;
    } else {
      result.push({
        kind: "blogs",
        key: `blogs-${blogsOccurrence}-${index}`,
        occurrence: blogsOccurrence,
      });
      blogsOccurrence += 1;
    }

    postsSinceModule = 0;
    nextGap = randomGap(random);
  });

  return result;
}

export function HomeScreen() {
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();
  const [compositionSeed, setCompositionSeed] = useState(() => Math.floor(Math.random() * 2_000_000_000));

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsFeed();
  const articlesQuery = useArticles({ perPage: 20 });
  const mediaQuery = usePublicMedia({ perPage: 20 });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const articles = useMemo(
    () => articlesQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [articlesQuery.data],
  );
  const media = useMemo(
    () => mediaQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [mediaQuery.data],
  );
  const feed = useMemo(() => composeHomeFeed(posts, compositionSeed), [compositionSeed, posts]);

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
  };

  const handleRefresh = () => {
    resetHeader();
    setCompositionSeed(Math.floor(Math.random() * 2_000_000_000));
    void Promise.all([refetch(), articlesQuery.refetch(), mediaQuery.refetch()]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
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

          if (item.kind === "reels") {
            const start = item.occurrence * 5;
            return (
              <HomeReelsSection
                items={media.slice(start, start + 5)}
                loading={mediaQuery.isLoading && media.length === 0}
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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || articlesQuery.isRefetching || mediaQuery.isRefetching}
            onRefresh={handleRefresh}
            tintColor="#405d72"
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              لا توجد منشورات لعرضها حالياً.
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-2">
              <HomePostCardSkeleton />
            </View>
          ) : hasNextPage ? (
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
