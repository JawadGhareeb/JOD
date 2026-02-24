import Tab from "@/components/ui/Tab";
import { tabs } from "@/utils/constant";
import { usePathname, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

const CustomTabBar = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const pathname = usePathname();

  const normalizePathname = (path: string) => {
    if (path.startsWith("/")) {
      return `/(root)/(tabs)${path}`;
    }
    return path;
  };

  const normalizedPathname = normalizePathname(pathname);

  const handleNavigate = (route: string) => {
    const currentTabIndex = tabs.findIndex((tab) =>
      normalizedPathname.startsWith(tab.route.replace("/(root)/(tabs)", ""))
    );
    const targetTabIndex = tabs.findIndex((tab) => tab.route === route);

    if (currentTabIndex === targetTabIndex && normalizedPathname === route) {
      return;
    }

    router.push(route as any);
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row"
      style={{
        backgroundColor: isDark ? "#181a20" : "white",
        borderTopColor: isDark ? "#262934" : "#E5E7EB",
        borderTopWidth: 1,
        paddingBottom: 12,
        paddingTop: 0,
        shadowColor: isDark ? "#000" : "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
      }}
    >
      {tabs.map((tab) => {
        const isFocused = normalizedPathname === tab.route;

        return (
          <Tab
            key={tab.name}
            focused={isFocused}
            iconName={tab.iconName!}
            title={tab.title}
            onPress={() => handleNavigate(tab.route)}
          />
        );
      })}
    </View>
  );
};

export default CustomTabBar;
