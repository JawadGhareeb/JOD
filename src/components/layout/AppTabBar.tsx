import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "./iconMap";

type TabKey = "home" | "profile" | "blogs";

const labels: Record<TabKey, string> = {
  home: "الرئيسية",
  profile: "الملف الشخصي",
  blogs: "المدونات",
};

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      className="border-t border-gray-200 bg-white px-3 pt-2"
    >
      <View className="flex-row-reverse items-center justify-between gap-2">
        {state.routes.map((route, index) => {
          const key = route.name as TabKey;
          const Icon = appIcons[key];
          const isFocused = state.index === index;
          const activeClass = isFocused
            ? "bg-primary-400/15"
            : "bg-transparent";
          const textClass = isFocused ? "text-primary-400" : "text-gray-400";

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
              <Icon size={18} color={isFocused ? "#405d72" : "#9CA3AF"} strokeWidth={2.25} />
              <Text
                numberOfLines={2}
                className={`mt-1 w-full text-center font-noto-medium text-[11px] leading-4 ${textClass}`}
              >
                {labels[key]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
