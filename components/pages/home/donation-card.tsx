import { Card, Logo } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";

interface DonationCardProps {
  title: string;
  description: string;
  amount?: string;
  progress?: number;
  type?: "volunteer_campaign" | "donation_campaign";
  onPress?: () => void;
}

const DonationCard: React.FC<DonationCardProps> = ({
  title,
  description,
  amount,
  progress,
  type,
  onPress,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const typeLabels = {
    volunteer_campaign: "حملة تطوعية",
    donation_campaign: "حملة تبرعات",
  };

  const typeColors = {
    volunteer_campaign: "#10B981",
    donation_campaign: "#3B82F6",
  };

  return (
    <Card
      onPress={onPress}
      padding="md"
      radius="md"
      elevated={Platform.OS === "android"}
      activeOpacity={0.8}
      className="gap-1 relative overflow-hidden"
    >
      {type && (
        <View className="flex-row items-center justify-between mb-1">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: `${typeColors[type]}15` }}
          >
            <Text
              size="2xs"
              weight="semibold"
              style={{ color: typeColors[type] }}
              rtlAlign="center"
            >
              {typeLabels[type]}
            </Text>
          </View>
        </View>
      )}
      <Text
        size="xs"
        weight="semibold"
        color={isDark ? "accent" : "primary"}
        rtlAlign="left"
      >
        {title}
      </Text>
      <Text
        size="2xs"
        className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
        rtlAlign="left"
      >
        {description}
      </Text>
      {amount !== undefined && progress !== undefined && (
        <View className="flex-row items-baseline justify-between gap-2">
          {amount !== undefined && (
            <Text
              size="base"
              weight="bold"
              color={isDark ? "accent" : "primary"}
              rtlAlign="left"
            >
              {amount}
            </Text>
          )}
          {progress !== undefined && (
            <View className="flex-1">
              <View
                className="h-2 rounded-full"
                style={{
                  backgroundColor: isDark ? "#35383f" : "#E5E7EB",
                }}
              >
                <View
                  className="h-2 rounded-full bg-primary-400"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          )}
        </View>
      )}

      <Logo
        variant="large"
        className="absolute top-[35%] translate-y-[-25%] right-0 opacity-25 object-contain flex justify-center items-center text-center rounded-full"
        showName
      />
    </Card>
  );
};

export default DonationCard;
