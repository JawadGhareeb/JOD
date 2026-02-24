import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { InfoCardProps } from "./types";

const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="px-4 mb-4 gap-2">
      <Text
        size="base"
        weight="bold"
        className={`${isDark ? "text-light-50" : "text-gray-800"}`}
        rtlAlign="left"
      >
        {title}
      </Text>
      <Card padding="md" radius="xl" elevated={Platform.OS === "android"}>
        <Text
          size="xs"
          className={`${isDark ? "text-gray-400" : "text-gray-500"} leading-7`}
          rtlAlign="left"
        >
          {content}
        </Text>
      </Card>
    </View>
  );
};

export default InfoCard;
