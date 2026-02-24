import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { SocialLinkCardProps } from "./types";

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({ link, onPress }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Card
      onPress={() => onPress(link.url)}
      className="mb-3 mx-4 flex-row items-center justify-between"
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
    >
      <View className="flex-row items-center flex-1 gap-2">
        <View
          className="size-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${link.color}15` }}
        >
          {link.icon}
        </View>
        <Text
          size="xs"
          weight="regular"
          className={`${isDark ? "text-light-50" : "text-gray-800"}`}
          rtlAlign="left"
        >
          {link.name}
        </Text>
      </View>
      <icons.externalLink size={20} color="#9CA3AF" />
    </Card>
  );
};

export default SocialLinkCard;
