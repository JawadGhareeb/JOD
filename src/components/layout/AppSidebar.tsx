import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/src/components/ui/Button";
import Dialog from "@/src/components/ui/Dialog";
import { appIcons } from "./iconMap";

const CloseIcon = appIcons.close;
const CreatePostIcon = appIcons.createPost;
const DonationsIcon = appIcons.myDonations;
const SavedPostsIcon = appIcons.savedPosts;
const LogoutIcon = appIcons.logout;
const LightModeIcon = appIcons.lightMode;
const DarkModeIcon = appIcons.darkMode;

type AppSidebarProps = {
  visible: boolean;
  onClose: () => void;
};

const menuItems = [
  { key: "create-post", label: "نشر بوست", Icon: CreatePostIcon },
  { key: "my-donations", label: "تبرعاتي", Icon: DonationsIcon },
  { key: "saved-posts", label: "بوستات محفوظة", Icon: SavedPostsIcon },
] as const;

export function AppSidebar({ visible, onClose }: AppSidebarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [shouldRender, setShouldRender] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const isDark = colorScheme === "dark";
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const panelClass = isDark
    ? "border-dark-400 bg-dark-500"
    : "border-gray-200 bg-white";
  const menuItemClass = isDark
    ? "bg-dark-350"
    : "bg-white";
  const iconColor = isDark ? "#F9FAFB" : "#405d72";
  const textColorClass = isDark ? "text-light-50" : "text-dark-100";

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
    outputRange: [0, 0.25],
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
        }}
        className={`absolute right-0 top-0 h-full w-[78%] max-w-[320px] border-l px-4 ${panelClass}`}
      >
        <View className="flex-1">
          <View className="flex-row-reverse items-center justify-between pb-4">
            <Text className={`font-noto-semibold text-lg ${textColorClass}`}>القائمة</Text>
            <Pressable
              onPress={closeSidebar}
              className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
            >
              <CloseIcon size={20} color="#405d72" strokeWidth={2.25} />
            </Pressable>
          </View>

          <View className="mt-3 gap-2">
            {menuItems.map((item) => (
              <Pressable
                key={item.key}
                className={`flex-row-reverse items-center justify-start gap-2 rounded-xl px-3 py-3 ${menuItemClass}`}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <item.Icon size={18} color={iconColor} strokeWidth={2.25} />
                <Text className={`font-noto-medium text-sm ${textColorClass}`}>{item.label}</Text>
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
                  onPress={() => {
                    setThemeMode("light");
                    setColorScheme("light");
                  }}
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
                  onPress={() => {
                    setThemeMode("dark");
                    setColorScheme("dark");
                  }}
                >
                  داكن
                </Button>
              </View>
            </View>
            <Button
              fullWidth
              variant="outline"
              leftIcon={<LogoutIcon size={18} color={iconColor} strokeWidth={2.25} />}
              onPress={() => setIsLogoutDialogOpen(true)}
            >
              تسجيل الخروج
            </Button>
          </View>
        </View>
      </Animated.View>

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
            onPress: closeSidebar,
          },
        ]}
      />
    </View>
  );
}
