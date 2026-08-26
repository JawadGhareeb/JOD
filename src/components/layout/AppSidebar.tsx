import Button from "@/src/components/ui/Button";
import Dialog from "@/src/components/ui/Dialog";
import { useAuthStatus, useLogout } from "@/src/features/auth/queries";
import { applyColorScheme } from "@/src/lib/theme";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { useRouter } from "expo-router";
import { LogIn } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "./iconMap";

const CloseIcon = appIcons.close;
const CreatePostIcon = appIcons.createPost;
const DonationsIcon = appIcons.myDonations;
const SavedPostsIcon = appIcons.savedPosts;
const SettingsIcon = appIcons.settings;
const HelpIcon = appIcons.help;
const ShieldIcon = appIcons.shield;
const AboutIcon = appIcons.about;
const LogoutIcon = appIcons.logout;
const LightModeIcon = appIcons.lightMode;
const DarkModeIcon = appIcons.darkMode;

type AppSidebarProps = {
  visible: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    key: "create-post",
    label: "نشر بوست",
    route: "/create-post",
    Icon: CreatePostIcon,
  },
  {
    key: "help-offers",
    label: "عروض المساعدة",
    route: "/help-offers",
    Icon: HelpIcon,
  },
  {
    key: "my-donations",
    label: "تبرعاتي",
    route: "/my-donations",
    Icon: DonationsIcon,
  },
  {
    key: "saved-posts",
    label: "بوستات محفوظة",
    route: "/saved-posts",
    Icon: SavedPostsIcon,
  },
  {
    key: "account-settings",
    label: "إعدادات الحساب",
    route: "/account-settings",
    Icon: SettingsIcon,
  },
  {
    key: "help-center",
    label: "مركز المساعدة",
    route: "/help-center",
    Icon: HelpIcon,
  },
  {
    key: "terms-privacy",
    label: "الشروط والخصوصية",
    route: "/terms-privacy",
    Icon: ShieldIcon,
  },
  { key: "about", label: "من نحن", route: "/about", Icon: AboutIcon },
] as const;

export function AppSidebar({ visible, onClose }: AppSidebarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const { isAuthenticated } = useAuthStatus();
  const logoutMutation = useLogout();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const [shouldRender, setShouldRender] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const isDark = colorScheme === "dark";
  const themeMode = isDark ? "dark" : "light";
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const panelClass = isDark
    ? "border-dark-400 bg-dark-500"
    : "border-gray-200 bg-white";
  const menuItemClass = isDark ? "bg-dark-350" : "bg-light-300";
  const actionBgClass = isDark ? "bg-dark-350" : "bg-primary-100";
  const iconColor = isDark ? "#F9FAFB" : PRIMARY_COLOR_LIGHT;
  const textColorClass = isDark ? "text-light-50" : "text-dark-100";
  const visibleMenuItems = isAuthenticated
    ? menuItems
    : menuItems.filter(
        (item) =>
          ![
            "help-offers",
            "my-donations",
            "saved-posts",
            "account-settings",
          ].includes(item.key),
      );

  const closeSidebar = () => {
    setIsLogoutDialogOpen(false);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsLogoutDialogOpen(false);
        setShouldRender(false);
      }
    });
  }, [visible, progress]);

  if (!shouldRender) {
    return null;
  }

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.55],
  });
  const panelTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 0],
  });

  return (
    <View className="absolute inset-0 z-50">
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <Pressable
        className="absolute inset-0"
        onPress={closeSidebar}
        accessibilityRole="button"
        accessibilityLabel="إغلاق القائمة الجانبية"
      />

      <Animated.View
        style={{
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 12),
          transform: [{ translateX: panelTranslateX }],
          shadowColor: "#000000",
          shadowOffset: { width: -4, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 16,
        }}
        className={`absolute right-0 top-0 h-full w-[78%] max-w-[320px] border-l px-4 ${panelClass}`}
      >
        <View className="flex-1">
          <View className="flex-row-reverse items-center justify-between pb-4">
            <Text className={`font-noto-semibold text-lg ${textColorClass}`}>
              القائمة
            </Text>
            <Pressable
              onPress={closeSidebar}
              className={`h-10 w-10 items-center justify-center rounded-xl ${actionBgClass}`}
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
            >
              <CloseIcon size={20} color={iconColor} strokeWidth={2.25} />
            </Pressable>
          </View>

          <View className="mt-3 gap-2">
            {visibleMenuItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => {
                  closeSidebar();
                  if (item.key === "create-post" && !requireAuth()) return;
                  router.push(item.route as never);
                }}
                className={`flex-row-reverse items-center justify-start gap-2 rounded-xl px-3 py-3 ${menuItemClass}`}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <item.Icon size={18} color={iconColor} strokeWidth={2.25} />
                <Text className={`font-noto-medium text-sm ${textColorClass}`}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-auto gap-3 pt-4">
            <View className="flex-row-reverse gap-2">
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
                  onPress={() => applyColorScheme("light")}
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
                  onPress={() => applyColorScheme("dark")}
                >
                  داكن
                </Button>
              </View>
            </View>

            {isAuthenticated ? (
              <Button
                fullWidth
                variant="outline"
                leftIcon={
                  <LogoutIcon size={18} color={iconColor} strokeWidth={2.25} />
                }
                onPress={() => setIsLogoutDialogOpen(true)}
              >
                تسجيل الخروج
              </Button>
            ) : (
              <Button
                fullWidth
                leftIcon={
                  <LogIn size={18} color="#FFFFFF" strokeWidth={2.25} />
                }
                onPress={() => {
                  closeSidebar();
                  router.push("/(auth)/login");
                }}
              >
                تسجيل الدخول
              </Button>
            )}
          </View>
        </View>
      </Animated.View>

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
              closeSidebar();
              toast.info(
                "يمكنك الاستمرار في تصفح جود كزائر.",
                "تم تسجيل الخروج",
              );
              router.replace("/(tabs)/home");
            },
          },
        ]}
      />
    </View>
  );
}
