import { Tabs } from "expo-router";
import { AppHeader } from "@/src/components/layout/AppHeader";

// Navigation moved from a bottom tab bar to the icon row inside AppHeader
// (AppTopNav) — the built-in tab bar is hidden entirely; AppTopNav drives
// navigation between these screens via router.push instead.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
      }}
      tabBar={() => null}
    >
      <Tabs.Screen name="home" options={{ title: "الرئيسية" }} />
      <Tabs.Screen name="student-assistance" options={{ title: "مساعدات طلابية" }} />
      <Tabs.Screen name="reels" options={{ title: "ريلز", headerShown: false }} />
      <Tabs.Screen name="notifications" options={{ title: "الإشعارات" }} />
      <Tabs.Screen name="profile" options={{ title: "الملف الشخصي" }} />
      <Tabs.Screen name="help-offers" options={{ title: "عروض المساعدة" }} />
      <Tabs.Screen name="create-post" options={{ title: "نشر بوست", href: null }} />
      <Tabs.Screen name="post" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ title: "الإعدادات", href: null }} />
    </Tabs>
  );
}
