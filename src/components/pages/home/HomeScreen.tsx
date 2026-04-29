import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { HOME_FILTER_ALL } from "@/src/constants/global";
import { mockHomePayload } from "@/src/data/mockHome";
import Text from "@/src/components/ui/Text";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";
import { HomeFilterType, HomeTypeSlider } from "./HomeTypeSlider";

export function HomeScreen() {
  const PAGE_SIZE = 6;
  const [selectedType, setSelectedType] = useState<HomeFilterType>(HOME_FILTER_ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredPosts = useMemo(() => {
    if (selectedType === HOME_FILTER_ALL) return mockHomePayload.posts;
    return mockHomePayload.posts.filter((post) => post.postType === selectedType);
  }, [selectedType]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  const hasMore = visibleCount < filteredPosts.length;

  const handleSelectType = (type: HomeFilterType) => {
    setSelectedType(type);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
      setLoadingMore(false);
    }, 550);
  };

  return (
    <FlatList
      className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300"
      contentContainerStyle={{ paddingBottom: 24 }}
      data={visiblePosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HomePostCard post={item} enableAuthorNavigation />}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.35}
      ListHeaderComponent={
        <HomeTypeSlider
          posts={mockHomePayload.posts}
          selectedType={selectedType}
          onSelectType={handleSelectType}
        />
      }
      ListEmptyComponent={
        <View className="items-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            لا توجد منشورات ضمن هذا النوع حالياً.
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
    
  );
}
