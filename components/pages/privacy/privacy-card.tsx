import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { PrivacyCardProps } from "./types";

const PrivacyCard: React.FC<PrivacyCardProps> = ({ section }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="mb-6">
      <Text
        size="base"
        weight="bold"
        color="primary"
        className={`${isDark ? "text-light-50" : "text-gray-800"} mb-2 px-4`}
        rtlAlign="left"
      >
        {section.title}
      </Text>
      <Card
        className="mx-4"
        padding="md"
        radius="xl"
        elevated={Platform.OS === "android"}
      >
        <Text
          size="xs"
          className={`${isDark ? "text-gray-400" : "text-gray-500"} leading-7`}
          rtlAlign="left"
        >
          {section.content}
        </Text>
      </Card>
    </View>
  );
};

export default PrivacyCard;
