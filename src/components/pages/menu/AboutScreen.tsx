import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

export function AboutScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="من نحن" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            منصة جود
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            منصة إنسانية تهدف لربط المحتاجين بالمتبرعين والمتطوعين عبر محتوى موثوق وسهل الوصول.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            الإصدار
          </Text>
          <Text size="xs" className="mt-2 text-gray-500 dark:text-gray-300">
            1.0.0
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
