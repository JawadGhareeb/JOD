import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { mockBlogsPayload } from "@/src/data/mockBlogs";
import type { BlogCategory } from "@/src/types/blogs";
import { BlogCategorySlider } from "./BlogCategorySlider";
import { BlogPostCard } from "./BlogPostCard";

const PAGE_SIZE = 6;

export function BlogsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
  };

  return (
    <FlatList
      className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300"
      contentContainerStyle={{ paddingBottom: 24 }}
      data={visiblePosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BlogPostCard post={item} />}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (!hasMore) return;
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
      }}
      onEndReachedThreshold={0.3}
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
        hasMore ? (
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
  );
}
