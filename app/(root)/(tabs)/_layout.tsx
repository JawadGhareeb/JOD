import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "@/src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: "NotoKufiArabic-SemiBold",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="donations-campaigns/index"
        options={{
          title: "التبرعات والحملات",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs/index"
        options={{
          title: "الوظائف",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "الملف",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="donations/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="opportunities/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
