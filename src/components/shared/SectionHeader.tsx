import { Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row-reverse items-center justify-between">
      <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
        {title}
      </Text>

      {actionLabel ? (
        <Pressable onPress={onActionPress} accessibilityRole="button">
          <Text size="sm" weight="medium" className="text-primary-400">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
