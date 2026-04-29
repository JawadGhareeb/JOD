import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "./iconMap";

const NotificationIcon = appIcons.notification;

export function AppHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : "#405d72";

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 8) }}
      className="flex-row-reverse items-center justify-between border-b border-gray-200 bg-white px-5 py-4 dark:border-dark-400 dark:bg-dark-500"
    >
      <View className="h-10 w-10" />
      <Text className="font-noto-semibold text-lg text-dark-100 dark:text-light-50">جود</Text>
      <Pressable
        onPress={() => router.push("/notifications")}
        className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
        accessibilityRole="button"
        accessibilityLabel="الإشعارات"
      >
        <NotificationIcon size={20} color={iconColor} strokeWidth={2.25} />
      </Pressable>
    </View>
  );
}
