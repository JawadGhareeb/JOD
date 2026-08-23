import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { useSavedPosts } from "@/src/features/posts/queries";
import type { HomePost } from "@/src/features/posts/types";
import { MenuPageHeader } from "./MenuPageHeader";

export function SavedPostsScreen() {
  const { data, isLoading, isError, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useSavedPosts();

  const [savedPosts, setSavedPosts] = useState<HomePost[]>([]);

  useEffect(() => {
    if (data) setSavedPosts(data.pages.flatMap((page) => page.items));
  }, [data]);

  const handleUnsavePost = (post: HomePost) => {
    setSavedPosts((prev) => prev.filter((item) => item.id !== post.id));
  };

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="بوستات محفوظة" />

      {isLoading ? (
        <View className="items-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            جارِ تحميل المنشورات المحفوظة...
          </Text>
        </View>
      ) : isError ? (
        <View className="items-center gap-3 py-8">
          <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">
            تعذر تحميل المنشورات المحفوظة. تحقق من اتصالك وحاول مرة أخرى.
          </Text>
          <Button size="small" onPress={() => void refetch()}>
            إعادة المحاولة
          </Button>
        </View>
      ) : (
        <FlatList
          data={savedPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HomePostCard
              post={item}
              enableAuthorNavigation
              mode="saved"
              onUnsave={handleUnsavePost}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={() => void refetch()}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View className="items-center py-8">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                لا توجد منشورات محفوظة حالياً.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <Text size="xs" className="py-4 text-center text-gray-500 dark:text-gray-300">
                جارِ تحميل المزيد...
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}
