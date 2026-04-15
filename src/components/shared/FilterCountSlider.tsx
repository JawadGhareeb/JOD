import { FlatList, Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { useRTL } from "@/src/providers/RTLProvider";

export type FilterCountSliderItem<T extends string> = {
  key: T;
  label: string;
  count: number;
};

type FilterCountSliderProps<T extends string> = {
  items: FilterCountSliderItem<T>[];
  selectedKey: T;
  onSelect: (key: T) => void;
};

export function FilterCountSlider<T extends string>({
  items,
  selectedKey,
  onSelect,
}: FilterCountSliderProps<T>) {
  const { currentLanguage } = useRTL();
  const isArabic = currentLanguage === "ar";

  return (
    <FlatList
      data={items}
      horizontal
      inverted={isArabic}
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
      className="mb-1"
      renderItem={({ item }) => {
        const isActive = selectedKey === item.key;

        return (
          <Pressable
            onPress={() => onSelect(item.key)}
            className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
              isActive ? "bg-primary-400/15" : "bg-white dark:bg-dark-500"
            }`}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Text
              size="xs"
              weight="medium"
              className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {item.label}
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
                {item.count}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}
