import { useMemo } from "react";
import { HOME_FILTER_ALL, HomePostTypeEnum } from "@/src/constants/global";
import { FilterCountSlider } from "@/src/components/shared";
import { HomePost } from "@/src/features/posts/types";

export type HomeFilterType = typeof HOME_FILTER_ALL | HomePostTypeEnum;

type FilterOption = {
  key: HomeFilterType;
  label: string;
};

const filterOptions: FilterOption[] = [
  { key: HOME_FILTER_ALL, label: "الكل" },
  { key: HomePostTypeEnum.DonationCampaign, label: "الحملات" },
  { key: HomePostTypeEnum.VolunteerOpportunity, label: "التطوع" },
  { key: HomePostTypeEnum.HelpRequest, label: "طلبات المساعدة" },
  { key: HomePostTypeEnum.ServiceOffer, label: "تقديم مساعدة" },
  { key: HomePostTypeEnum.CampaignUpdate, label: "تحديثات الحملات" },
  { key: HomePostTypeEnum.Awareness, label: "منشورات توعوية" },
];

type HomeTypeSliderProps = {
  selectedType: HomeFilterType;
  onSelectType: (type: HomeFilterType) => void;
  posts: HomePost[];
};

export function HomeTypeSlider({
  selectedType,
  onSelectType,
  posts,
}: HomeTypeSliderProps) {
  const items = useMemo(
    () =>
      filterOptions.map((option) => ({
        key: option.key,
        label: option.label,
        count:
          option.key === HOME_FILTER_ALL
            ? posts.length
            : posts.filter((post) => post.postType === option.key).length,
      })),
    [posts],
  );

  return (
    <FilterCountSlider
      items={items}
      selectedKey={selectedType}
      onSelect={onSelectType}
    />
  );
}
