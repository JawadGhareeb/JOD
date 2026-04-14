import { FlatList, Pressable, View } from "react-native";
import { HOME_FILTER_ALL, HomePostTypeEnum } from "@/src/constants/global";
import Text from "@/src/components/ui/Text";
import { useRTL } from "@/src/providers/RTLProvider";
import { HomePost } from "@/src/types/home";

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
  const { currentLanguage } = useRTL();
  const isArabic = currentLanguage === "ar";

  const getCount = (type: HomeFilterType) => {
    if (type === HOME_FILTER_ALL) return posts.length;
    return posts.filter((post) => post.postType === type).length;
  };

  return (
    <FlatList
      data={filterOptions}
      horizontal
      inverted={isArabic}
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
      className="mb-1"
      renderItem={({ item: option }) => {
        const isActive = selectedType === option.key;

        return (
          <Pressable
            key={option.key}
            onPress={() => onSelectType(option.key)}
            className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
              isActive
                ? "bg-primary-400/15"
                : "bg-white dark:bg-dark-500"
            }`}
            accessibilityRole="button"
            accessibilityLabel={option.label}
          >
            <Text
              size="xs"
              weight="medium"
              className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {option.label}
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
                {getCount(option.key)}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}
