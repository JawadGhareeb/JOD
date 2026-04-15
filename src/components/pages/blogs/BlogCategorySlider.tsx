import { useMemo } from "react";
import { FilterCountSlider } from "@/src/components/shared";
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
  const items = useMemo(
    () =>
      categories.map((category) => ({
        key: category,
        label: BLOG_CATEGORY_LABELS[category],
        count:
          category === "all"
            ? posts.length
            : posts.filter((post) => post.category === category).length,
      })),
    [posts],
  );

  return (
    <FilterCountSlider
      items={items}
      selectedKey={selectedCategory}
      onSelect={onSelectCategory}
    />
  );
}
