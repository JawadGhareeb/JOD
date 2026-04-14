import { FlatList, Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { useRTL } from "@/src/providers/RTLProvider";
import { BLOG_CATEGORY_LABELS } from "@/src/data/mockBlogs";
import type { BlogCategory, BlogPost } from "@/src/types/blogs";

type BlogCategorySliderProps = {
  selectedCategory: BlogCategory;
  onSelectCategory: (category: BlogCategory) => void;
  posts: BlogPost[];
};

const categories = Object.keys(BLOG_CATEGORY_LABELS) as BlogCategory[];

export function BlogCategorySlider({
  selectedCategory,
  onSelectCategory,
  posts,
}: BlogCategorySliderProps) {
  const { currentLanguage } = useRTL();
  const isArabic = currentLanguage === "ar";

  const getCount = (category: BlogCategory) => {
    if (category === "all") return posts.length;
    return posts.filter((post) => post.category === category).length;
  };

  return (
    <FlatList
      data={categories}
      horizontal
      inverted={isArabic}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
      className="mb-1"
      renderItem={({ item: category }) => {
        const isActive = selectedCategory === category;

        return (
          <Pressable
            onPress={() => onSelectCategory(category)}
            className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
              isActive ? "bg-primary-400/15" : "bg-white dark:bg-dark-500"
            }`}
          >
            <Text
              size="xs"
              weight="medium"
              className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {BLOG_CATEGORY_LABELS[category]}
            </Text>
            <View
              className={`size-6 items-center justify-center rounded-full ${
                isActive ? "bg-primary-400" : "bg-gray-200 dark:bg-dark-350"
              }`}
            >
              <Text
                size="2xs"
                weight="medium"
                className={isActive ? "text-light-50" : "text-gray-600 dark:text-gray-200"}
              >
                {getCount(category)}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}
