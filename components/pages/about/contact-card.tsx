import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { ContactCardProps } from "./types";

const ContactCard: React.FC<ContactCardProps> = ({ title, items }) => {
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
        {items.map((item, index) => (
          <View key={index} className="flex-row items-center gap-2">
            {item.icon}
            <Text
              size="xs"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
              rtlAlign="left"
            >
              {item.text}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
};

export default ContactCard;
