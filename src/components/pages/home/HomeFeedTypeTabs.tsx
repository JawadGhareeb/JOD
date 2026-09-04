import { Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import type { PersonalizedFeedType } from "@/src/features/personalization/types";

const OPTIONS: { value: PersonalizedFeedType; label: string }[] = [
  { value: "for_you", label: "لك" },
  { value: "following", label: "المتابَعون" },
  { value: "nearby", label: "بالقرب منك" },
  { value: "urgent", label: "عاجل" },
];

export function HomeFeedTypeTabs({ value, onChange }: { value: PersonalizedFeedType; onChange: (value: PersonalizedFeedType) => void }) {
  return (
    <View className="mb-3 flex-row-reverse gap-2" accessibilityRole="tablist">
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={`flex-1 items-center rounded-xl border px-2 py-2.5 ${selected ? "border-primary-400 bg-primary-400" : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"}`}
          >
            <Text size="2xs" weight="semibold" className={selected ? "text-white" : "text-gray-600 dark:text-gray-200"}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
