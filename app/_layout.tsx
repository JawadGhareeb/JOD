import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
        <StatusBar style="dark" translucent={false} backgroundColor="#FFFFFF" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
