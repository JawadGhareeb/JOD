import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { LegalCardProps } from "./types";

const LegalCard: React.FC<LegalCardProps> = ({ copyright, description }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="px-4 mb-4">
      <Card
        background={isDark ? "bg-dark-500" : "bg-gray-100"}
        elevated={Platform.OS === "android"}
      >
        <Text
          size="xs"
          className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center mb-2`}
          rtlAlign="center"
        >
          {copyright}
        </Text>
        <Text
          size="2xs"
          className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}
          rtlAlign="center"
        >
          {description}
        </Text>
      </Card>
    </View>
  );
};

export default LegalCard;
