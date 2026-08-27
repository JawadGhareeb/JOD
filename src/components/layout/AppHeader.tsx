import { usePathname, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Animated, Pressable, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useRTL } from "@/src/providers/RTLProvider";
import { headerScrollY } from "@/src/providers/CollapsibleHeaderProvider";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { AppTopNav, getActiveTabTitle } from "./AppTopNav";
import { appIcons } from "./iconMap";

const SearchIcon = appIcons.search;
const CreatePostIcon = appIcons.createPost;
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
  const { requireAuth } = useAuthGuard();
  const [contentHeight, setContentHeight] = useState(MIN_HEADER_CONTENT_HEIGHT);
  const isDark = colorScheme === "dark";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : PRIMARY_COLOR_LIGHT;
  const surfaceColor = isDark ? "#1f222b" : "#FFFFFF";
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const activeTabTitle = useMemo(() => getActiveTabTitle(pathname), [pathname]);

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

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const measuredHeight = Math.ceil(event.nativeEvent.layout.height);
    if (measuredHeight > 0 && measuredHeight !== contentHeight) {
      setContentHeight(measuredHeight);
    }
  };

  const openCreatePost = () => {
    if (!requireAuth()) return;
    router.push("/(tabs)/create-post");
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
        {topInsetHeight > 0 ? <View style={{ height: topInsetHeight, backgroundColor: surfaceColor }} /> : null}
        <View onLayout={handleHeaderLayout}>
          <View className="px-4 py-3">
            <View className={`${rowClassName} items-center justify-between`}>
              <View className={`min-w-0 flex-1 ${rowClassName} items-center gap-2`}>
                <Logo width={26} height={26} />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  size="xl"
                  weight="bold"
                  className={`flex-1 ${activeTabTitle ? "text-dark-100 dark:text-light-50" : "text-primary-400"}`}
                >
                  {activeTabTitle ?? "JOD"}
                </Text>
              </View>

              <View className={`${rowClassName} items-center gap-2`}>
                <Pressable
                  onPress={openCreatePost}
                  className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
                  accessibilityRole="button"
                  accessibilityLabel="إضافة بوست"
                >
                  <CreatePostIcon size={21} color={iconColor} strokeWidth={2.4} />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/search")}
                  className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
                  accessibilityRole="button"
                  accessibilityLabel="البحث"
                >
                  <SearchIcon size={20} color={iconColor} strokeWidth={2.25} />
                </Pressable>
              </View>
            </View>
          </View>
          <AppTopNav />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
