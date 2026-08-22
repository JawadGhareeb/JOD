import { useMemo } from "react";
import { Animated, RefreshControl, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { usePostsFeed } from "@/src/features/posts/queries";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";

export function HomeScreen() {
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();

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

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handleRefresh = () => {
    resetHeader();
    void refetch();
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
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HomePostCard post={item} enableAuthorNavigation />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor="#405d72" />
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
