import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";

const BackIcon = appIcons.chevronRight;

type MenuPageHeaderProps = {
  title: string;
};

export function MenuPageHeader({ title }: MenuPageHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 8) }}
      className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
    >
      <Pressable
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/15"
        accessibilityRole="button"
        accessibilityLabel="رجوع"
      >
        <BackIcon size={20} color="#405d72" strokeWidth={2.25} />
      </Pressable>

      <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
        {title}
      </Text>

      <View className="h-10 w-10" />
    </View>
  );
}
