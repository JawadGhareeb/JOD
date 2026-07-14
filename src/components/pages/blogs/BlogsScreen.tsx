import { useMemo, useState } from "react";
import { Animated, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { mockBlogsPayload } from "@/src/data/mockBlogs";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import type { BlogCategory } from "@/src/types/blogs";
import { BlogCategorySlider } from "./BlogCategorySlider";
import { BlogPostCard } from "./BlogPostCard";
import { BlogPostCardSkeleton } from "./BlogPostCardSkeleton";

const PAGE_SIZE = 6;

export function BlogsScreen() {
  const { onScroll } = useCollapsibleHeaderScreen();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return mockBlogsPayload.posts;
    return mockBlogsPayload.posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  const hasMore = visibleCount < filteredPosts.length;

  const onSelectCategory = (category: BlogCategory) => {
    setSelectedCategory(category);
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
      setLoadingMore(false);
    }, 500);
  };

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <Animated.FlatList
        className="flex-1 px-4 dark:bg-dark-300"
        contentContainerStyle={{ paddingBottom: 24 }}
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BlogPostCard post={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <BlogCategorySlider
            posts={mockBlogsPayload.posts}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        }
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              لا توجد مقالات ضمن هذا التصنيف حاليًا
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-2">
              <BlogPostCardSkeleton />
            </View>
          ) : hasMore ? (
            <View className="py-2" />
          ) : (
            <View className="items-center py-4">
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                تم عرض جميع المقالات
              </Text>
            </View>
          )
        }
        />
    </View>
  );
}
