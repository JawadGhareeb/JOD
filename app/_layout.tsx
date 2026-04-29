import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Appearance } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
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
    // Default app theme to system mode on startup.
    setColorScheme(Appearance.getColorScheme() ?? "light");
  }, [setColorScheme]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          style={isDark ? "light" : "dark"}
          translucent={false}
          backgroundColor={isDark ? "#1f222b" : "#FFFFFF"}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="author/[id]" />
          <Stack.Screen name="blogs/[id]" />
          <Stack.Screen name="about" />
          <Stack.Screen name="account-settings" />
          <Stack.Screen name="create-post" />
          <Stack.Screen name="help-center" />
          <Stack.Screen name="my-donations" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="saved-posts" />
          <Stack.Screen name="terms-privacy" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
