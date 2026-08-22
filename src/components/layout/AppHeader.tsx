import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useMemo, useState } from "react";
import { Animated, Pressable, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/src/components/shared/Avatar";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useRTL } from "@/src/providers/RTLProvider";
import { headerScrollY } from "@/src/providers/CollapsibleHeaderProvider";
import { appIcons } from "./iconMap";

const NotificationIcon = appIcons.notification;
const SearchIcon = appIcons.search;
const UserIcon = appIcons.profile;
const MIN_HEADER_CONTENT_HEIGHT = 64;

type AppHeaderProps = {
  includeTopInset?: boolean;
};

export function AppHeader({ includeTopInset = true }: AppHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const { isAuthenticated, isLoading, user, refreshAuthStatus } = useAuthStatus();
  const [contentHeight, setContentHeight] = useState(MIN_HEADER_CONTENT_HEIGHT);
  const isDark = colorScheme === "dark";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : "#405d72";
  // Animated.View often doesn't re-apply NativeWind className when the scheme
  // changes — drive the surface color via style so light/dark always sync.
  const surfaceColor = isDark ? "#1f222b" : "#FFFFFF";
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const justifyClassName = isRTL ? "items-end" : "items-start";

  const displayName = useMemo(() => user?.name?.trim() ?? "", [user?.name]);

  const topInsetHeight = includeTopInset ? insets.top : 0;
  const resolvedContentHeight = Math.max(contentHeight, MIN_HEADER_CONTENT_HEIGHT);
  const headerHeight = topInsetHeight + resolvedContentHeight;
  const collapseRange = Math.max(1, headerHeight);
  const clampedScrollY = Animated.diffClamp(headerScrollY, 0, collapseRange);
  const wrapperHeight = clampedScrollY.interpolate({
    inputRange: [0, collapseRange],
    outputRange: [headerHeight, 0],
    extrapolate: "clamp",
  });
  const contentTranslateY = clampedScrollY.interpolate({
    inputRange: [0, collapseRange],
    outputRange: [0, -headerHeight],
    extrapolate: "clamp",
  });

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

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const measuredHeight = Math.ceil(event.nativeEvent.layout.height);
    if (measuredHeight > 0 && measuredHeight !== contentHeight) {
      setContentHeight(measuredHeight);
    }
  };

  return (
    <Animated.View
      style={{
        height: wrapperHeight,
        overflow: "hidden",
        zIndex: 20,
        elevation: 20,
        backgroundColor: surfaceColor,
      }}
    >
      <Animated.View
        style={{
          height: headerHeight,
          transform: [{ translateY: contentTranslateY }],
          overflow: "hidden",
          backgroundColor: surfaceColor,
        }}
      >
        {topInsetHeight > 0 ? (
          <View style={{ height: topInsetHeight, backgroundColor: surfaceColor }} />
        ) : null}
        <View onLayout={handleHeaderLayout} className="px-5 py-3">
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
      </Animated.View>
    </Animated.View>
  );
}
