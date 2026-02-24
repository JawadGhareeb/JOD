import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { SettingCardProps } from "./types";

const SettingsCard = ({
  title,
  description,
  icon,
  color,
  onPress,
  showArrow = true,
}: SettingCardProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Card
      onPress={onPress}
      className="mb-4 mx-4"
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 gap-4">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            {icon}
          </View>
          <View className="flex-1">
            <Text
              size="sm"
              weight="semibold"
              className={`${isDark ? "text-light-50" : "text-gray-800"}`}
              rtlAlign="left"
            >
              {title}
            </Text>
            <Text
              size="2xs"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
              rtlAlign="left"
            >
              {description}
            </Text>
          </View>
        </View>
        {showArrow && <icons.chevronLeft size={20} color="#9CA3AF" />}
      </View>
    </Card>
  );
};

export default SettingsCard;
