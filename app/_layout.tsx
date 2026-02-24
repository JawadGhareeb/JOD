import { ToastSetup } from "@/components/ui";
import { AppDataProvider } from "@/src/context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { I18nManager, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RTLProvider, useRTL } from "../providers";
import "./global.css";

SplashScreen.preventAutoHideAsync();

const applyGlobalRtlTextDefaults = () => {
  const TextAny = Text as any;
  const InputAny = TextInput as any;

  const textDefaults = TextAny.defaultProps ?? {};
  TextAny.defaultProps = {
    ...textDefaults,
    style: [
      { writingDirection: "rtl", textAlign: "right" },
      textDefaults.style,
    ],
  };

  const inputDefaults = InputAny.defaultProps ?? {};
  InputAny.defaultProps = {
    ...inputDefaults,
    textAlign: "right",
    style: [
      { writingDirection: "rtl", textAlign: "right" },
      inputDefaults.style,
    ],
  };
};

applyGlobalRtlTextDefaults();

const DirectionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isRTL } = useRTL();
  return (
    <View style={{ flex: 1, direction: isRTL ? "rtl" : "ltr" }}>{children}</View>
  );
};

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const regular = require("../assets/fonts/Noto/NotoKufiArabic-Regular.ttf");
  const semiBold = require("../assets/fonts/Noto/NotoKufiArabic-SemiBold.ttf");
  const bold = require("../assets/fonts/Noto/NotoKufiArabic-Bold.ttf");

  const [fontsLoaded] = useFonts({
    "NotoKufiArabic-Regular": regular,
    "NotoKufiArabic-SemiBold": semiBold,
    "NotoKufiArabic-Bold": bold,
    "NotoKufiArabic-Thin": regular,
    "NotoKufiArabic-ExtraLight": regular,
    "NotoKufiArabic-Light": regular,
    "NotoKufiArabic-Medium": semiBold,
    "NotoKufiArabic-ExtraBold": bold,
    "NotoKufiArabic-Black": bold,
  });

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
    I18nManager.swapLeftAndRightInRTL(true);

    if (!colorScheme) {
      setColorScheme("light");
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [colorScheme, fontsLoaded, setColorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RTLProvider>
          <AppDataProvider>
            <DirectionWrapper>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: I18nManager.isRTL
                    ? "slide_from_left"
                    : "slide_from_right",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              >
                <Stack.Screen name="(root)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>
              <ToastSetup />
            </DirectionWrapper>
          </AppDataProvider>
        </RTLProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
