import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { StatsCardProps } from "./types";
const StatsCard: React.FC<StatsCardProps> = ({ title, stats }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="px-4">
      <Card
        background={isDark ? "bg-dark-500" : "bg-primary-300"}
        bordered={false}
        elevated={Platform.OS === "android"}
      >
        <Text
          size="base"
          weight="semibold"
          className={`${isDark ? "text-light-50" : "text-primary-400"} mb-2`}
          rtlAlign="center"
        >
          {title}
        </Text>
        <View className="flex-row justify-around">
          {stats.map((stat, index) => (
            <View key={index} className="items-center">
              <Text
                size="xs"
                weight="bold"
                className={isDark ? "text-light-50" : "text-primary-400"}
                rtlAlign="center"
              >
                {stat.value}
              </Text>
              <Text
                size="2xs"
                className={isDark ? "text-light-50" : "text-primary-400"}
                rtlAlign="center"
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
};

export default StatsCard;
