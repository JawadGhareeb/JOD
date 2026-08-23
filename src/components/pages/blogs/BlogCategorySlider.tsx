import { useMemo } from "react";
import { FilterCountSlider } from "@/src/components/shared";
import { useCategories } from "@/src/features/posts/queries";

type BlogCategorySliderProps = {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

export function BlogCategorySlider({
  selectedCategoryId,
  onSelectCategory,
}: BlogCategorySliderProps) {
  const categoriesQuery = useCategories({ status: "active" });

  const items = useMemo(
    () => [
      { key: "all", label: "الكل" },
      ...(categoriesQuery.data?.items ?? []).map((category) => ({
        key: category.id,
        label: category.name,
      })),
    ],
    [categoriesQuery.data?.items],
  );

  return (
    <FilterCountSlider
      items={items}
      selectedKey={selectedCategoryId}
      onSelect={onSelectCategory}
    />
  );
}
