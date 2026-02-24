import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { FeaturesCardProps } from "./types";

const FeaturesCard: React.FC<FeaturesCardProps> = ({ title, features }) => {
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
      <Card
        className="gap-2"
        padding="md"
        radius="xl"
        elevated={Platform.OS === "android"}
      >
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center gap-2">
            <View
              className={`size-6 rounded-full items-center justify-center ${isDark ? "bg-dark-500" : "bg-primary-300"}`}
              style={{
                backgroundColor: isDark ? "rgba(105,73,255,0.18)" : "#FAF5FF",
              }}
            >
              <icons.check size={14} color="#6949ff" />
            </View>
            <Text
              size="xs"
              className={`${isDark ? "text-gray-400" : "text-gray-500"} flex-1`}
              rtlAlign="left"
            >
              {feature}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
};

export default FeaturesCard;
