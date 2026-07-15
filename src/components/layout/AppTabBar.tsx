import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRTL } from "@/src/providers/RTLProvider";
import { resetHeader } from "@/src/providers/CollapsibleHeaderProvider";
import { appIcons } from "./iconMap";

type TabKey = "home" | "blogs" | "create-post" | "profile" | "settings";

const tabConfig: Record<
  TabKey,
  {
    label: string;
    Icon: (typeof appIcons)[keyof typeof appIcons];
  }
> = {
  home: { label: "الرئيسية", Icon: appIcons.home },
  blogs: { label: "المدونات", Icon: appIcons.blogs },
  "create-post": { label: "نشر بوست", Icon: appIcons.createPost },
  profile: { label: "الملف الشخصي", Icon: appIcons.profile },
  settings: { label: "الإعدادات", Icon: appIcons.settings },
};

const CreatePostIcon = appIcons.createPost;

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const floatingRoute = state.routes.find((route) => route.name === "create-post");

  const triggerTabPress = (routeName: string, routeKey: string, routeParams?: object) => {
    resetHeader();

    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate({
        name: routeName as never,
        params: routeParams as never,
      } as never);
    }
  };

  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      }}
      className="relative border-t border-gray-200 bg-white px-3 dark:border-dark-400 dark:bg-dark-500"
    >
      <View className={`${rowClassName} items-center justify-between gap-2`}>
        {state.routes.map((route, index) => {
          const key = route.name as TabKey;
          const config = tabConfig[key];
          if (!config) {
            return null;
          }

          if (key === "create-post") {
            return <View key={route.key} className="min-h-[48px] flex-1" />;
          }

          const { label, Icon } = config;
          const isFocused = state.index === index;
          const activeClass = isFocused ? "bg-primary-400/15" : "bg-transparent";
          const textClass = isFocused
            ? "text-primary-400"
            : isDark
              ? "text-gray-300"
              : "text-gray-400";

          const onPress = () => {
            if (!isFocused) {
              triggerTabPress(route.name, route.key, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
              testID={descriptors[route.key].options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className={`min-h-[54px] flex-1 items-center justify-center rounded-2xl px-2 py-1.5 ${activeClass}`}
            >
              <Icon
                size={18}
                color={isFocused ? "#405d72" : isDark ? "#D1D5DB" : "#9CA3AF"}
                strokeWidth={2.25}
              />
              <Text
                numberOfLines={2}
                className={`mt-1 w-full text-center font-noto-medium text-[11px] leading-4 ${textClass}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {floatingRoute ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={state.routes[state.index].key === floatingRoute.key ? { selected: true } : {}}
          accessibilityLabel={descriptors[floatingRoute.key].options.tabBarAccessibilityLabel}
          testID={descriptors[floatingRoute.key].options.tabBarButtonTestID}
          onPress={() => triggerTabPress(floatingRoute.name, floatingRoute.key, floatingRoute.params)}
          onLongPress={() => {
            navigation.emit({
              type: "tabLongPress",
              target: floatingRoute.key,
            });
          }}
          style={{
            position: "absolute",
            top: -16,
            left: "50%",
            width: 56,
            height: 56,
            marginLeft: -28,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#405d72",
            shadowColor: "#1F2937",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.24,
            shadowRadius: 14,
            elevation: 10,
          }}
        >
          <CreatePostIcon size={22} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </View>
  );
}
