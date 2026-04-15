import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

const settingRows = [
  { title: "تعديل المعلومات الشخصية", hint: "الاسم، البريد، رقم الجوال" },
  { title: "تغيير كلمة المرور", hint: "تحديث كلمة المرور للحساب" },
  { title: "إدارة الإشعارات", hint: "اختيار أنواع الإشعارات التي تصلك" },
];

export function AccountSettingsScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="إعدادات الحساب" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {settingRows.map((row) => (
          <Card key={row.title} padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {row.title}
            </Text>
            <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
              {row.hint}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
