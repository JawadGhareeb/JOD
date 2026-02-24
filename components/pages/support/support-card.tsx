import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { SupportCardProps } from "./types";

const SupportCard: React.FC<SupportCardProps> = ({ option }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Card
      onPress={option.action}
      className="mb-3 mx-4 flex-row items-center justify-between"
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="size-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${option.color}15` }}
        >
          {option.icon}
        </View>
        <View className="flex-1">
          <Text
            size="xs"
            weight="semibold"
            className={`${isDark ? "text-light-50" : "text-gray-800"}`}
            rtlAlign="left"
          >
            {option.title}
          </Text>
          <Text
            size="2xs"
            color="secondary"
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            rtlAlign="left"
          >
            {option.description}
          </Text>
        </View>
      </View>
      <icons.chevronLeft size={20} color="#6B7280" />
    </Card>
  );
};

export default SupportCard;
