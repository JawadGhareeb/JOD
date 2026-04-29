import { ScrollView, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { appIcons } from "@/src/components/layout/iconMap";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

type SettingsRow = {
  title: string;
  hint: string;
  Icon: (typeof appIcons)[keyof typeof appIcons];
  route: Href;
};

const settingRows: SettingsRow[] = [
  {
    title: "تعديل المعلومات الشخصية",
    hint: "الاسم، البريد، رقم الجوال",
    Icon: appIcons.profile,
    route: "/edit-information",
  },
  {
    title: "تغيير كلمة المرور",
    hint: "تحديث كلمة المرور للحساب",
    Icon: appIcons.shield,
    route: "/change-password",
  },
];
const ArrowIcon = appIcons.chevronLeft;

export function AccountSettingsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="إعدادات الحساب" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {settingRows.map((row) => (
          <Card
            key={row.title}
            padding="sm"
            className="mb-3 border-gray-200 dark:border-dark-400"
            onPress={() => router.push(row.route)}
            accessibilityRole="button"
            accessibilityLabel={row.title}
          >
            <View className="flex-row-reverse items-center justify-between">
              <View className="flex-1 flex-row-reverse items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
                  <row.Icon size={18} color="#405d72" strokeWidth={2.25} />
                </View>
                <View className="flex-1">
                  <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                    {row.title}
                  </Text>
                  <Text size="xs" className="text-gray-500 dark:text-gray-300">
                    {row.hint}
                  </Text>
                </View>
              </View>
              <ArrowIcon size={16} color="#9CA3AF" strokeWidth={2.25} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
