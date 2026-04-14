import { Tabs } from "expo-router";
import { useState } from "react";
import { AppHeader } from "@/src/components/layout/AppHeader";
import { AppSidebar } from "@/src/components/layout/AppSidebar";
import { AppTabBar } from "@/src/components/layout/AppTabBar";

export default function TabsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          header: () => <AppHeader onMenuPress={() => setIsSidebarOpen(true)} />,
        }}
        tabBar={(props) => <AppTabBar {...props} />}
      >
        <Tabs.Screen name="home" options={{ title: "الرئيسية" }} />
        <Tabs.Screen name="blogs" options={{ title: "المدونات" }} />
        <Tabs.Screen name="profile" options={{ title: "الملف الشخصي" }} />
      </Tabs>
      <AppSidebar visible={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
