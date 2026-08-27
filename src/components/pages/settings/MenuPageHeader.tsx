import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { getPrimaryColor } from "@/src/theme";

const BackIcon = appIcons.chevronRight;

type MenuPageHeaderProps = {
  title: string;
  onBackPress?: () => void;
};

export function MenuPageHeader({ title, onBackPress }: MenuPageHeaderProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  return (
    <View className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400">
      <Pressable
        onPress={onBackPress ?? (() => router.back())}
        className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/15"
        accessibilityRole="button"
        accessibilityLabel="رجوع"
      >
        <BackIcon size={20} color={primaryColor} strokeWidth={2.25} />
      </Pressable>

      <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
        {title}
      </Text>

      <View className="h-10 w-10" />
    </View>
  );
}
