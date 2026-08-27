import { useColorScheme } from "nativewind";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Text from "./Text";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={`flex-row rounded-lg p-1 ${isDark ? "bg-dark-500" : "bg-gray-100"}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={`flex-1 rounded-md px-4 py-2 ${isActive ? (isDark ? "bg-dark-400" : "bg-white") : "bg-transparent"}`}
            activeOpacity={0.7}
          >
            <Text
              size="xs"
              weight={isActive ? "semibold" : "medium"}
              className={isActive ? "text-primary-400" : isDark ? "text-gray-400" : "text-gray-500"}
              rtlAlign="center"
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabs;
