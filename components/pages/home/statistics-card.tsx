import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onPress?: () => void;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  color,
  onPress,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card
      onPress={onPress}
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
      activeOpacity={0.8}
      style={{ minWidth: 200 }}
      className="flex-row items-center gap-3"
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text
          size="xs"
          className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
          rtlAlign="left"
        >
          {title}
        </Text>
        <Text
          size="base"
          weight="bold"
          className={`${isDark ? "text-light-50" : "text-gray-800"}`}
          rtlAlign="left"
        >
          {value}
        </Text>
      </View>
    </Card>
  );
};

export default StatisticsCard;
