import { Tabs } from "expo-router";
import { AppHeader } from "@/src/components/layout/AppHeader";
import { AppTabBar } from "@/src/components/layout/AppTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "الرئيسية" }} />
      <Tabs.Screen name="reels" options={{ title: "ريلز", headerShown: false }} />
      <Tabs.Screen name="create-post" options={{ title: "نشر بوست" }} />
      <Tabs.Screen name="post" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: "الملف الشخصي" }} />
      <Tabs.Screen name="settings" options={{ title: "الإعدادات" }} />
    </Tabs>
  );
}
