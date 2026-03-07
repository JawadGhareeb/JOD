import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

interface AuthRequiredStateProps {
  message?: string;
  buttonLabel?: string;
  onPressSignIn: () => void;
}

export const AuthRequiredState = ({
  message = "يجب تسجيل الدخول للوصول إلى هذه الصفحة.",
  buttonLabel = "تسجيل الدخول",
  onPressSignIn,
}: AuthRequiredStateProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="px-4 py-6">
      <Card>
        <View className="gap-3">
          <Text
            size="sm"
            weight="semibold"
            className={`${isDark ? "text-light-50" : "text-gray-800"}`}
            rtlAlign="left"
          >
            تسجيل الدخول مطلوب
          </Text>
          <Text
            size="xs"
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            rtlAlign="left"
          >
            {message}
          </Text>
          <Button onPress={onPressSignIn}>{buttonLabel}</Button>
        </View>
      </Card>
    </View>
  );
};
