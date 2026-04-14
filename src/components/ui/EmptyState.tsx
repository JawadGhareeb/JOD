import { useColorScheme } from "nativewind";
import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import Text from "./Text";
import { cn } from "@/src/lib";

interface EmptyStateProps {
  title: string;
  image: ImageSourcePropType;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, image, className }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className={cn("flex-1 items-center gap-4 pt-10", className)}>
      <Image source={image} className="w-48 h-48" resizeMode="contain" />
      <Text
        size="xs"
        weight="medium"
        rtlAlign="center"
        className={isDark ? "text-light-50" : "text-gray-500"}
      >
        {title}
      </Text>
    </View>
  );
};
