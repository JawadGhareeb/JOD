import { Card, Logo } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform } from "react-native";

interface OpportunityCardProps {
  title: string;
  description: string;
  location?: string;
  onPress?: () => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  description,
  location,
  onPress,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card
      onPress={onPress}
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
      activeOpacity={0.8}
      className="relative overflow-hidden"
    >
      <Text
        size="sm"
        weight="semibold"
        color={isDark ? "accent" : "primary"}
        rtlAlign="left"
      >
        {title}
      </Text>
      <Text
        size="xs"
        className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
        rtlAlign="left"
      >
        {description}
      </Text>
      {location && (
        <Text
          size="2xs"
          weight="bold"
          color={isDark ? "accent" : "primary"}
          rtlAlign="left"
        >
          {location}
        </Text>
      )}
      <Logo
        variant="medium"
        className="absolute top-2 right-0 opacity-25 object-contain flex justify-center items-center text-center rounded-full"
        showName
      />
    </Card>
  );
};

export default OpportunityCard;
