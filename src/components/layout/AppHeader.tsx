import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { headerScrollY } from "@/src/providers/CollapsibleHeaderProvider";
import { useRTL } from "@/src/providers/RTLProvider";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { usePathname, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppTopNav, getActiveTabTitle } from "./AppTopNav";
import {
  EMPTY_CREATE_MENU_ANCHOR,
  HeaderCreateMenu,
  type CreateMenuAnchor,
} from "./HeaderCreateMenu";
import { appIcons } from "./iconMap";

const SearchIcon = appIcons.search;
const CreatePostIcon = appIcons.createPost;
const MIN_NAV_HEIGHT = 52;

type AppHeaderProps = {
  includeTopInset?: boolean;
};

export function AppHeader({ includeTopInset = true }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const { requireAuth } = useAuthGuard();
  const createButtonRef = useRef<View>(null);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [createMenuAnchor, setCreateMenuAnchor] = useState<CreateMenuAnchor>(
    EMPTY_CREATE_MENU_ANCHOR,
  );
  const [navBarHeight, setNavBarHeight] = useState(MIN_NAV_HEIGHT);
  const isDark = colorScheme === "dark";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : PRIMARY_COLOR_LIGHT;
  const surfaceColor = isDark ? "#1f222b" : "#FFFFFF";
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const activeTabTitle = useMemo(() => getActiveTabTitle(pathname), [pathname]);
  const showTopNav = segments[0] === "(tabs)";

  const topInsetHeight = includeTopInset ? insets.top : 0;
  const resolvedNavHeight = Math.max(navBarHeight, MIN_NAV_HEIGHT);
  const navCollapseRange = Math.max(1, resolvedNavHeight);
  const clampedScrollY = Animated.diffClamp(headerScrollY, 0, navCollapseRange);
  const navWrapperHeight = clampedScrollY.interpolate({
    inputRange: [0, navCollapseRange],
    outputRange: [resolvedNavHeight, 0],
    extrapolate: "clamp",
  });
  const navTranslateY = clampedScrollY.interpolate({
    inputRange: [0, navCollapseRange],
    outputRange: [0, -resolvedNavHeight],
    extrapolate: "clamp",
  });

  const handleNavLayout = (event: LayoutChangeEvent) => {
    const measuredHeight = Math.ceil(event.nativeEvent.layout.height);
    if (measuredHeight > 0 && measuredHeight !== navBarHeight) {
      setNavBarHeight(measuredHeight);
    }
  };

  // "+" opens a menu so the choice is explicit and available from every screen,
  // rather than silently changing meaning depending on the active tab.
  const openCreateMenu = () => {
    if (!requireAuth()) return;
    const anchorNode = createButtonRef.current;
    if (!anchorNode) {
      setIsCreateMenuOpen(true);
      return;
    }
    anchorNode.measureInWindow((x, y, width, height) => {
      setCreateMenuAnchor({ x, y, width, height });
      setIsCreateMenuOpen(true);
    });
  };

  const handleCreateSelect = (key: "post" | "group") => {
    setIsCreateMenuOpen(false);
    router.push(key === "group" ? ("/groups/create" as never) : "/(tabs)/create-post");
  };

  return (
    <View
      style={{
        zIndex: 20,
        elevation: 20,
        backgroundColor: surfaceColor,
      }}
    >
      {topInsetHeight > 0 ? (
        <View style={{ height: topInsetHeight, backgroundColor: surfaceColor }} />
      ) : null}

      {/* Logo + actions — always visible on every screen, never collapses on scroll */}
      <View>
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
                ref={createButtonRef}
                onPress={openCreateMenu}
                className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
                accessibilityRole="button"
                accessibilityLabel="إنشاء"
                accessibilityState={{ expanded: isCreateMenuOpen }}
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
      </View>

      {/* Tab nav — main tabs only; collapses on scroll */}
      {showTopNav ? (
        <Animated.View
          style={{
            height: navWrapperHeight,
            overflow: "hidden",
            backgroundColor: surfaceColor,
          }}
        >
          <Animated.View
            style={{
              transform: [{ translateY: navTranslateY }],
              backgroundColor: surfaceColor,
            }}
          >
            <View onLayout={handleNavLayout}>
              <AppTopNav />
            </View>
          </Animated.View>
        </Animated.View>
      ) : null}

      <HeaderCreateMenu
        visible={isCreateMenuOpen}
        anchor={createMenuAnchor}
        onClose={() => setIsCreateMenuOpen(false)}
        onSelect={handleCreateSelect}
      />
    </View>
  );
}
