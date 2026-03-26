import { Card, Logo } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { I18nManager, Platform, View } from "react-native";
import { NotificationCardProps } from "./types";

const NotificationCard: React.FC<NotificationCardProps> = ({
  image,
  title,
  description,
  onPress,
  isRead = false,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Card
      onPress={onPress}
      className={`mx-4 mb-4 gap-3 items-center ${I18nManager.isRTL ? "flex-row-reverse" : "flex-row"}`}
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
    >
      <View className="size-16 rounded-full overflow-hidden">
        <Logo style={{ width: "100%", height: "100%" }} showName={false} />
      </View>

      <View className="flex-1">
        <Text
          size="base"
          weight="bold"
          className={`${isDark ? "text-light-50" : "text-gray-800"}`}
          rtlAlign="left"
        >
          {title}
        </Text>
        <Text
          size="xs"
          color="secondary"
          className="text-gray-500 mt-1"
          rtlAlign="left"
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>

      {!isRead && (
        <View className={`w-2 h-2 bg-primary-400 rounded-full ${I18nManager.isRTL ? "mr-2" : "ml-2"}`} />
      )}
    </Card>
  );
};

export default NotificationCard;
