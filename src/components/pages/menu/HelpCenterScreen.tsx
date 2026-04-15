import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import Button from "@/src/components/ui/Button";
import { MenuPageHeader } from "./MenuPageHeader";

const faqItems = [
  "كيف أضيف منشور جديد؟",
  "كيف أتابع حالة التبرع؟",
  "كيف أتواصل مع الجهة الناشرة؟",
  "كيف أبلغ عن محتوى غير مناسب؟",
];

export function HelpCenterScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="مركز المساعدة" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            الأسئلة الشائعة
          </Text>
          <View className="mt-3 gap-2">
            {faqItems.map((item) => (
              <Text key={item} size="xs" className="text-gray-600 dark:text-gray-200">
                • {item}
              </Text>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            تواصل معنا
          </Text>
          <Text size="xs" className="mt-2 text-gray-500 dark:text-gray-300">
            support@jod.org
          </Text>
          <View className="mt-3">
            <Button fullWidth size="small">فتح تذكرة دعم</Button>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
