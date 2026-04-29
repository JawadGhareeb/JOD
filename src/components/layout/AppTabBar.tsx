import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      className="border-t border-gray-200 bg-white px-3 pt-2 dark:border-dark-400 dark:bg-dark-500"
    >
      <View className="flex-row-reverse items-center justify-between gap-2">
        {state.routes.map((route, index) => {
          const key = route.name as TabKey;
          const config = tabConfig[key];
          if (!config) {
            return null;
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
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
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
              className={`min-h-[60px] flex-1 items-center justify-center rounded-2xl px-2 py-2 ${activeClass}`}
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
    </View>
  );
}
