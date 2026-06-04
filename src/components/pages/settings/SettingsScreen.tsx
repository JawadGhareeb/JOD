import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Text from "@/src/components/ui/Text";
import { clearMockAuth } from "@/src/lib/auth";

type SettingsRow = {
  title: string;
  hint: string;
  Icon: (typeof appIcons)[keyof typeof appIcons];
  route: Href;
};

type SettingsGroup = {
  title: string;
  rows: SettingsRow[];
};

const settingsGroups: SettingsGroup[] = [
  {
    title: "الحساب",
    rows: [
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
    ],
  },
  {
    title: "نشاطي",
    rows: [
      {
        title: "تبرعاتي",
        hint: "ملخص التبرعات والحملات",
        Icon: appIcons.myDonations,
        route: "/my-donations",
      },
      {
        title: "بوستات محفوظة",
        hint: "المنشورات التي قمت بحفظها",
        Icon: appIcons.savedPosts,
        route: "/saved-posts",
      },
    ],
  },
  {
    title: "الدعم والمعلومات",
    rows: [
      {
        title: "مركز المساعدة",
        hint: "الأسئلة الشائعة وطرق التواصل",
        Icon: appIcons.help,
        route: "/help-center",
      },
      {
        title: "الشروط والخصوصية",
        hint: "سياسة الاستخدام وحماية البيانات",
        Icon: appIcons.shield,
        route: "/terms-privacy",
      },
      {
        title: "من نحن",
        hint: "تعرف على منصة جود",
        Icon: appIcons.about,
        route: "/about",
      },
    ],
  },
];

const ArrowIcon = appIcons.chevronLeft;
const LightModeIcon = appIcons.lightMode;
const DarkModeIcon = appIcons.darkMode;
const LogoutIcon = appIcons.logout;

export function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const isDark = colorScheme === "dark";
  const themeMode = useMemo(() => (isDark ? "dark" : "light"), [isDark]);
  const iconColor = isDark ? "#F9FAFB" : "#405d72";

  return (
    <View className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {settingsGroups.map((group) => (
          <View key={group.title} className="mb-3">
            <Text weight="semibold" size="xs" className="mb-2 px-1 text-gray-500 dark:text-gray-300">
              {group.title}
            </Text>
            {group.rows.map((row, index) => (
              <Card
                key={row.title}
                padding="sm"
                className={`border-gray-200 dark:border-dark-400 ${index === group.rows.length - 1 ? "" : "mb-2"}`}
                onPress={() => router.push(row.route)}
                accessibilityRole="button"
                accessibilityLabel={row.title}
              >
                <View className="flex-row-reverse items-center justify-between">
                  <View className="flex-1 flex-row-reverse items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
                      <row.Icon size={18} color={iconColor} strokeWidth={2.25} />
                    </View>
                    <View className="flex-1">
                      <Text
                        weight="semibold"
                        size="sm"
                        className="text-dark-100 dark:text-light-50"
                      >
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
          </View>
        ))}

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            المظهر
          </Text>
          <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
            اختر النمط المناسب للتطبيق.
          </Text>

          <View className="mt-3 flex-row-reverse gap-2">
            <View className="flex-1">
              <Button
                fullWidth
                size="small"
                variant={themeMode === "light" ? "primary" : "tertiary"}
                leftIcon={
                  <LightModeIcon
                    size={16}
                    color={themeMode === "light" ? "#FFFFFF" : iconColor}
                    strokeWidth={2.25}
                  />
                }
                onPress={() => setColorScheme("light")}
              >
                فاتح
              </Button>
            </View>
            <View className="flex-1">
              <Button
                fullWidth
                size="small"
                variant={themeMode === "dark" ? "primary" : "tertiary"}
                leftIcon={
                  <DarkModeIcon
                    size={16}
                    color={themeMode === "dark" ? "#FFFFFF" : iconColor}
                    strokeWidth={2.25}
                  />
                }
                onPress={() => setColorScheme("dark")}
              >
                داكن
              </Button>
            </View>
          </View>
        </Card>

        <Button
          fullWidth
          variant="outline"
          leftIcon={<LogoutIcon size={18} color={iconColor} strokeWidth={2.25} />}
          onPress={() => setIsLogoutDialogOpen(true)}
        >
          تسجيل الخروج
        </Button>
      </ScrollView>

      <Dialog
        visible={isLogoutDialogOpen}
        title="تأكيد تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        icon={<LogoutIcon size={26} color="#DC2626" strokeWidth={2.25} />}
        onClose={() => setIsLogoutDialogOpen(false)}
        buttons={[
          {
            text: "إلغاء",
            variant: "tertiary",
            onPress: () => setIsLogoutDialogOpen(false),
          },
          {
            text: "تسجيل الخروج",
            variant: "primary",
            onPress: async () => {
              setIsLogoutDialogOpen(false);
              await clearMockAuth();
              router.replace("/(auth)/login");
            },
          },
        ]}
      />
    </View>
  );
}
