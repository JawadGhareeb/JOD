import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/src/components/shared/Avatar";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { useRTL } from "@/src/providers/RTLProvider";
import { appIcons } from "./iconMap";

const NotificationIcon = appIcons.notification;
const SearchIcon = appIcons.search;
const UserIcon = appIcons.profile;

export function AppHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const { isAuthenticated, isLoading, user, refreshAuthStatus } = useAuthStatus();
  const isDark = colorScheme === "dark";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : "#405d72";
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const justifyClassName = isRTL ? "items-end" : "items-start";
  const displayName = useMemo(
    () => [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim(),
    [user?.firstName, user?.lastName],
  );

  useFocusEffect(
    useCallback(() => {
      void refreshAuthStatus();
    }, [refreshAuthStatus]),
  );

  const handleUserPress = () => {
    if (isAuthenticated) {
      router.push("/(tabs)/profile");
      return;
    }

    router.push("/(auth)/login");
  };

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 8) }}
      className="border-b border-gray-200 bg-white px-5 py-4 dark:border-dark-400 dark:bg-dark-500"
    >
      <View className={`${rowClassName} items-center justify-between`}>
        <View className={`w-[124px] min-h-[40px] ${justifyClassName} justify-center`}>
          <Pressable
            onPress={handleUserPress}
            disabled={isLoading}
            className={`${rowClassName} max-w-full items-center gap-2 rounded-xl px-2 py-1 ${
              isLoading ? "opacity-60" : "opacity-100"
            }`}
            accessibilityRole="button"
            accessibilityLabel={isAuthenticated ? "الملف الشخصي" : "تسجيل الدخول"}
          >
            {isAuthenticated && displayName ? (
              <>
                <Avatar name={displayName} size={34} />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  size="xs"
                  weight="semibold"
                  className="max-w-[78px] text-dark-100 dark:text-light-50"
                >
                  {displayName}
                </Text>
              </>
            ) : (
              <View className="rounded-xl bg-primary-400 px-3 py-2">
                <Text size="xs" weight="semibold" className="text-light-50">
                  Log in
                </Text>
              </View>
            )}
            {isAuthenticated && !displayName ? (
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-dark-350">
                <UserIcon size={18} color={iconColor} strokeWidth={2.25} />
              </View>
            ) : null}
          </Pressable>
        </View>

        <View className="flex-1 items-center px-3">
          <Text size="lg" weight="semibold" className="text-dark-100 dark:text-light-50">
            جود
          </Text>
        </View>

        <View className={`w-[124px] ${rowClassName} items-center justify-end gap-2`}>
          <Pressable
            onPress={() => router.push("/search")}
            className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
            accessibilityRole="button"
            accessibilityLabel="البحث"
          >
            <SearchIcon size={20} color={iconColor} strokeWidth={2.25} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/notifications")}
            className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
            accessibilityRole="button"
            accessibilityLabel="الإشعارات"
          >
            <NotificationIcon size={20} color={iconColor} strokeWidth={2.25} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
