import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

export function TermsPrivacyScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="الشروط والخصوصية" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            سياسة الاستخدام
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            استخدام المنصة يجب أن يكون ضمن الأهداف الإنسانية، ويُمنع نشر أي محتوى مضلل أو مسيء أو غير موثق.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            الخصوصية
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            نحافظ على بيانات المستخدمين ونستخدمها فقط لتحسين تجربة التطبيق وتسهيل الوصول للمحتوى والخدمات.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
