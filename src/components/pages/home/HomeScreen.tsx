import { useCallback, useMemo, useState } from "react";
import { Animated, RefreshControl, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { mockHomePayload } from "@/src/data/mockHome";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";

const PAGE_SIZE = 6;

export function HomeScreen() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();
  const filteredPosts = useMemo(() => mockHomePayload.posts, []);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
      setLoadingMore(false);
    }, 550);
  };

  const handleRefresh = useCallback(() => {
    resetHeader();
    setRefreshing(true);
    setLoadingMore(false);
    setTimeout(() => {
      setVisibleCount(PAGE_SIZE);
      setRefreshing(false);
    }, 650);
  }, [resetHeader]);

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <Animated.FlatList
        className="flex-1 px-4"
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HomePostCard post={item} enableAuthorNavigation />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#405d72" />
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
          loadingMore ? (
            <View className="py-2">
              <HomePostCardSkeleton />
            </View>
          ) : hasMore ? (
            <View className="py-3" />
          ) : (
            <View className="items-center py-4">
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                تم عرض جميع المنشورات
              </Text>
            </View>
          )
          }
        />
    </View>
  );
}
