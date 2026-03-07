import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

const LanguageSettings = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="اللغة" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
      >
        <Card className="mx-4">
          <Text
            size="sm"
            weight="semibold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} mb-2`}
            rtlAlign="left"
          >
            العربية
          </Text>
          <Text
            size="xs"
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            rtlAlign="left"
          >
            العربية هي اللغة الافتراضية الحالية للتطبيق.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

export default LanguageSettings;
