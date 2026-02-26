import { ROUTES } from "@/constants/routers";
import { colors } from "@/src/theme";
import { getAuthToken } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();

  const handleProtectedPostPress = async (onPress?: () => void) => {
    const token = await getAuthToken();

    if (token) {
      onPress?.();
      return;
    }

    router.push(ROUTES.AUTH.SIGN_IN as any);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 6,
          paddingBottom: 8,
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
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="donations-campaigns/index"
        options={{
          title: "التبرعات والحملات",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="posts/index"
        options={{
          title: "منشور",
          tabBarButton: (props) => {
            const focused = !!props.accessibilityState?.selected;

            return (
              <Pressable
                accessibilityRole={props.accessibilityRole}
                accessibilityState={props.accessibilityState}
                accessibilityLabel={props.accessibilityLabel}
                testID={props.testID}
                onPress={() =>
                  handleProtectedPostPress(props.onPress as (() => void) | undefined)
                }
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    marginTop: -24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: focused ? colors.primaryDark : colors.primary,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 6,
                  }}
                >
                  <Ionicons name="add" size={28} color="#FFFFFF" />
                </View>
                <Text
                  style={{
                    fontFamily: "NotoKufiArabic-SemiBold",
                    fontSize: 11,
                    marginTop: 4,
                    color: focused ? colors.primary : colors.textMuted,
                  }}
                >
                  منشور
                </Text>
              </Pressable>
            );
          },
        }}
      />

      <Tabs.Screen
        name="jobs/index"
        options={{
          title: "الوظائف",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "الملف",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
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
