import { useMemo, useState } from "react";
import { Animated, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { LogIn } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import { ThemeSwitcher } from "@/src/components/shared/ThemeSwitcher";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Text from "@/src/components/ui/Text";
import { useAuthStatus, useLogout } from "@/src/features/auth/queries";
import { getPrimaryColor } from "@/src/theme";
import { useToast } from "@/src/providers/ToastProvider";
import { MenuPageHeader } from "./MenuPageHeader";

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
      {
        title: "تخصيص المحتوى",
        hint: "الاهتمامات، نوع المساعدة، الموقع والتوفر",
        Icon: appIcons.settings,
        route: "/personalization-settings" as Href,
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
        title: "طلبات المساعدة",
        hint: "العروض التي أرسلتها أو استقبلتها",
        Icon: appIcons.help,
        route: "/help-offers" as Href,
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
const LogoutIcon = appIcons.logout;

export function SettingsScreen() {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { isAuthenticated } = useAuthStatus();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const iconColor = getPrimaryColor(isDark);
  const arrowIconColor = isDark ? "#D1D5DB" : "#9CA3AF";
  const visibleGroups = useMemo(
    () =>
      isAuthenticated
        ? settingsGroups
        : settingsGroups.filter((group) => group.title === "الدعم والمعلومات"),
    [isAuthenticated],
  );

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="الإعدادات" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {visibleGroups.map((group) => (
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
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/15">
                      <row.Icon size={18} color={iconColor} strokeWidth={2.25} />
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
                  <ArrowIcon size={16} color={arrowIconColor} strokeWidth={2.25} />
                </View>
              </Card>
            ))}
          </View>
        ))}

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            المظهر
          </Text>
          <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
            اختر النمط المناسب — يُطبَّق فوراً على كامل التطبيق.
          </Text>

          <View className="mt-3">
            <ThemeSwitcher />
          </View>
        </Card>

        {isAuthenticated ? (
          <Button
            fullWidth
            variant="tertiary"
            className="border border-error-300/30 bg-error-300/5 dark:bg-error-300/10"
            leftIcon={<LogoutIcon size={18} color="#DC2626" strokeWidth={2.25} />}
            onPress={() => setIsLogoutDialogOpen(true)}
          >
            تسجيل الخروج
          </Button>
        ) : (
          <Button
            fullWidth
            leftIcon={<LogIn size={18} color="#FFFFFF" strokeWidth={2.25} />}
            onPress={() => router.push("/(auth)/login")}
          >
            تسجيل الدخول
          </Button>
        )}
      </Animated.ScrollView>

      <Dialog
        visible={isAuthenticated && isLogoutDialogOpen}
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
              await logoutMutation.mutateAsync();
              toast.info("يمكنك الاستمرار في تصفح جود كزائر.", "تم تسجيل الخروج");
              router.replace("/(tabs)/home");
            },
          },
        ]}
      />
    </View>
  );
}
