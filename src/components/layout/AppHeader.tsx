import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useMemo, useState } from "react";
import { Animated, Pressable, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useRTL } from "@/src/providers/RTLProvider";
import { headerScrollY } from "@/src/providers/CollapsibleHeaderProvider";
import { AppSidebar } from "./AppSidebar";
import { AppTopNav, getActiveTabTitle } from "./AppTopNav";
import { appIcons } from "./iconMap";

const SearchIcon = appIcons.search;
const MenuIcon = appIcons.menu;
const MoreIcon = appIcons.more;
const MIN_HEADER_CONTENT_HEIGHT = 64;

type AppHeaderProps = {
  includeTopInset?: boolean;
};

export function AppHeader({ includeTopInset = true }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const { refreshAuthStatus } = useAuthStatus();
  const [contentHeight, setContentHeight] = useState(MIN_HEADER_CONTENT_HEIGHT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDark = colorScheme === "dark";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : "#405d72";
  // Animated.View often doesn't re-apply NativeWind className when the scheme
  // changes — drive the surface color via style so light/dark always sync.
  const surfaceColor = isDark ? "#1f222b" : "#FFFFFF";
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";

  const activeTabTitle = useMemo(() => getActiveTabTitle(pathname), [pathname]);
  const isReelsTab = pathname === "/reels" || pathname.startsWith("/reels/");

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

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const measuredHeight = Math.ceil(event.nativeEvent.layout.height);
    if (measuredHeight > 0 && measuredHeight !== contentHeight) {
      setContentHeight(measuredHeight);
    }
  };

  return (
    <>
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
        <View onLayout={handleHeaderLayout}>
        <View className="px-4 py-3">
          <View className={`${rowClassName} items-center justify-between`}>
            <View className={`${rowClassName} min-w-0 flex-1 items-center gap-2`}>
              <Pressable
                onPress={() => setIsSidebarOpen(true)}
                className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
                accessibilityRole="button"
                accessibilityLabel="القائمة"
              >
                <MenuIcon size={20} color={iconColor} strokeWidth={2.25} />
              </Pressable>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                size="base"
                weight="bold"
                className="shrink text-dark-100 dark:text-light-50"
              >
                {activeTabTitle ?? "جود"}
              </Text>
            </View>

            <View className={`${rowClassName} items-center gap-2`}>
              <Pressable
                onPress={() => router.push("/search")}
                className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
                accessibilityRole="button"
                accessibilityLabel="البحث"
              >
                <SearchIcon size={20} color={iconColor} strokeWidth={2.25} />
              </Pressable>
              {isReelsTab ? (
                <Pressable
                  onPress={() => setIsSidebarOpen(true)}
                  className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
                  accessibilityRole="button"
                  accessibilityLabel="خيارات إضافية"
                >
                  <MoreIcon size={20} color={iconColor} strokeWidth={2.25} />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>

        <AppTopNav />
        </View>
      </Animated.View>
    </Animated.View>

    <AppSidebar visible={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
