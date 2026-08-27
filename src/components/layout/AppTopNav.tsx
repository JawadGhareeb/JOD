import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useUnreadNotificationCount } from "@/src/features/notifications/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { getPrimaryColor } from "@/src/theme";
import { usePathname, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { appIcons } from "./iconMap";

type TopNavKey = "home" | "student" | "reels" | "notifications" | "profile";

export const TOP_NAV_ITEMS: {
  key: TopNavKey;
  path: `/${string}`;
  Icon: (typeof appIcons)[keyof typeof appIcons];
  requiresAuth: boolean;
  label: string;
}[] = [
  { key: "home", path: "/(tabs)/home", Icon: appIcons.home, requiresAuth: false, label: "الرئيسية" },
  { key: "student", path: "/(tabs)/student-assistance", Icon: appIcons.studentHub, requiresAuth: false, label: "مساعدات طلابية" },
  { key: "reels", path: "/(tabs)/reels", Icon: appIcons.reels, requiresAuth: false, label: "ريلز" },
  { key: "notifications", path: "/(tabs)/notifications", Icon: appIcons.notification, requiresAuth: true, label: "الإشعارات" },
  { key: "profile", path: "/(tabs)/profile", Icon: appIcons.profile, requiresAuth: true, label: "الملف الشخصي" },
];

export function getActiveTabTitle(pathname: string): string | null {
  const match = TOP_NAV_ITEMS.find((item) => {
    const tabPath = item.path.replace("/(tabs)", "");
    return pathname === tabPath || pathname.startsWith(`${tabPath}/`);
  });
  if (!match || match.key === "home") return null;
  return match.label;
}

export function AppTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();
  const { isAuthenticated } = useAuthStatus();
  const { requireAuth } = useAuthGuard();
  const { data: unreadNotificationCount = 0 } = useUnreadNotificationCount(isAuthenticated);
  const activeColor = getPrimaryColor(colorScheme === "dark");
  const inactiveColor = "#9CA3AF";

  return (
    <View className="flex-row-reverse items-stretch border-t border-gray-100 pb-2 dark:border-dark-400">
      {TOP_NAV_ITEMS.map((item) => {
        const tabPath = item.path.replace("/(tabs)", "");
        const isActive = pathname === tabPath || pathname.startsWith(`${tabPath}/`);
        const handlePress = () => {
          if (item.requiresAuth && !requireAuth()) return;
          router.push(item.path as never);
        };

        return (
          <Pressable
            key={item.key}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            className="relative flex-1 items-center justify-center py-3"
          >
            <item.Icon
              size={24}
              color={isActive ? activeColor : inactiveColor}
              fill={item.key === "home" && isActive ? activeColor : "transparent"}
              strokeWidth={isActive ? 2.25 : 2}
            />
            {item.key === "notifications" && isAuthenticated && unreadNotificationCount > 0 ? (
              <View className="absolute right-[28%] top-1 min-w-4 items-center justify-center rounded-full bg-error-300 px-1">
                <Text size="2xs" weight="semibold" className="text-light-50">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </Text>
              </View>
            ) : null}
            <View
              className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-t-full"
              style={{ backgroundColor: isActive ? activeColor : "transparent" }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
