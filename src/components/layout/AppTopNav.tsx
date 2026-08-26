import { useRouter, usePathname } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { useUnreadNotificationCount } from "@/src/features/notifications/queries";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { getPrimaryColor } from "@/src/theme";
import { appIcons } from "./iconMap";

type TopNavKey = "home" | "reels" | "notifications" | "profile" | "help-offers";

// Shared with AppHeader, which reads .label to show a per-tab title instead
// of always showing the "جود" logo.
export const TOP_NAV_ITEMS: { key: TopNavKey; path: `/${string}`; Icon: (typeof appIcons)[keyof typeof appIcons]; requiresAuth: boolean; label: string }[] = [
  { key: "home", path: "/(tabs)/home", Icon: appIcons.home, requiresAuth: false, label: "الرئيسية" },
  { key: "reels", path: "/(tabs)/reels", Icon: appIcons.reels, requiresAuth: false, label: "ريلز" },
  { key: "notifications", path: "/(tabs)/notifications", Icon: appIcons.notification, requiresAuth: true, label: "الإشعارات" },
  { key: "profile", path: "/(tabs)/profile", Icon: appIcons.profile, requiresAuth: true, label: "الملف الشخصي" },
  { key: "help-offers", path: "/(tabs)/help-offers", Icon: appIcons.help, requiresAuth: true, label: "عروض المساعدة" },
];

/** Returns the tab's Arabic label for the current pathname, or null on Home
 * (where AppHeader shows the "جود" logo instead) or an unrecognized route. */
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
  const isDark = colorScheme === "dark";
  const activeColor = getPrimaryColor(isDark);
  const inactiveColor = isDark ? "#9CA3AF" : "#9CA3AF";

  return (
    <View className="flex-row-reverse items-stretch border-t border-gray-100 pb-2 dark:border-dark-400">
      {TOP_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path.replace("/(tabs)", "") || pathname.startsWith(item.path.replace("/(tabs)", ""));

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
            className="relative flex-1 items-center justify-center py-2.5"
          >
            <item.Icon size={24} color={isActive ? activeColor : inactiveColor} strokeWidth={isActive ? 2.5 : 2} />
            {item.key === "notifications" && isAuthenticated && unreadNotificationCount > 0 ? (
              <View className="absolute right-[28%] top-1 min-w-4 items-center justify-center rounded-full bg-error-300 px-1">
                <Text size="2xs" weight="semibold" className="text-light-50">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </Text>
              </View>
            ) : null}
            <View
              className="mt-2 h-[3px] w-8 rounded-full"
              style={{ backgroundColor: isActive ? activeColor : "transparent" }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
