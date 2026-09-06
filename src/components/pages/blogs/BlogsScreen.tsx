import { useMemo } from "react";
import { Animated, ActivityIndicator, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useArticles } from "@/src/features/articles/queries";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { BlogPostCard } from "./BlogPostCard";

export function BlogsScreen() {
  const { onScroll } = useCollapsibleHeaderScreen();
  const query = useArticles({ perPage: 20 });
  const posts = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="المقالات" />
      <Animated.FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BlogPostCard post={item} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={() => { if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage(); }}
        onEndReachedThreshold={0.4}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void query.refetch()}
        ListEmptyComponent={query.isLoading ? <View className="items-center py-10"><ActivityIndicator /><Text size="xs" className="mt-3 text-gray-500 dark:text-gray-300">جارِ تحميل المقالات...</Text></View> : <View className="items-center py-10"><Text size="sm" className="text-gray-500 dark:text-gray-300">لا توجد مقالات منشورة حالياً.</Text></View>}
        ListFooterComponent={query.isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
      />
    </View>
  );
}
