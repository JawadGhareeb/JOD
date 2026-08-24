import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { colorScheme as nativewindColorScheme, useColorScheme } from "nativewind";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/src/lib/query-client";
import { loadStoredColorScheme } from "@/src/lib/theme";
import { RTLProvider } from "@/src/providers/RTLProvider";
import { AuthGuardProvider } from "@/src/providers/AuthGuardProvider";
import { ToastProvider } from "@/src/providers/ToastProvider";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [fontsLoaded] = useFonts({
    "NotoKufiArabic-Regular": require("../assets/fonts/Noto/NotoKufiArabic-Regular.ttf"),
    "NotoKufiArabic-Medium": require("../assets/fonts/Noto/NotoKufiArabic-Medium.ttf"),
    "NotoKufiArabic-SemiBold": require("../assets/fonts/Noto/NotoKufiArabic-SemiBold.ttf"),
    "NotoKufiArabic-Bold": require("../assets/fonts/Noto/NotoKufiArabic-Bold.ttf"),
    "NotoKufiArabic-Black": require("../assets/fonts/Noto/NotoKufiArabic-Black.ttf"),
    "NotoKufiArabic-Thin": require("../assets/fonts/Noto/NotoKufiArabic-Thin.ttf"),
    "NotoKufiArabic-ExtraLight": require("../assets/fonts/Noto/NotoKufiArabic-ExtraLight.ttf"),
    "NotoKufiArabic-Light": require("../assets/fonts/Noto/NotoKufiArabic-Light.ttf"),
    "NotoKufiArabic-ExtraBold": require("../assets/fonts/Noto/NotoKufiArabic-ExtraBold.ttf"),
  });

  useEffect(() => {
    // Restore the user's last choice once. Do NOT re-sync to system Appearance
    // on every render — useColorScheme()'s setColorScheme identity changes and
    // was resetting the theme (and desyncing the header from the body).
    let cancelled = false;

    void loadStoredColorScheme().then((stored) => {
      if (cancelled || !stored) return;
      nativewindColorScheme.set(stored);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RTLProvider>
          <SafeAreaProvider>
            <ToastProvider>
              <AuthGuardProvider>
                <StatusBar
                  style={isDark ? "light" : "dark"}
                  translucent={false}
                  backgroundColor={isDark ? "#1f222b" : "#FFFFFF"}
                />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="apply/[id]" />
                  <Stack.Screen name="author/[id]" />
                  <Stack.Screen name="donate/[id]" />
                  <Stack.Screen name="blogs/[id]" />
                  <Stack.Screen name="blogs/index" />
                  <Stack.Screen name="about" />
                  <Stack.Screen name="account-settings" />
                  <Stack.Screen name="change-password" />

                  <Stack.Screen name="edit-information" />
                  <Stack.Screen name="help-center" />
                  <Stack.Screen name="my-donations" />
                  <Stack.Screen name="notifications" />
                  <Stack.Screen name="posts/[id]" />
                  <Stack.Screen name="saved-posts" />
                  <Stack.Screen name="search" />
                  <Stack.Screen name="terms-privacy" />
                </Stack>
              </AuthGuardProvider>
            </ToastProvider>
          </SafeAreaProvider>
        </RTLProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
