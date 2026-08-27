import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { colorScheme as nativewindColorScheme } from "nativewind";

const THEME_KEY = "jod_color_scheme";

export type AppColorScheme = "light" | "dark";

const THEME_BACKGROUND: Record<AppColorScheme, string> = {
  light: "#FFFFFF",
  dark: "#1f222b",
};

export function getThemeBackground(scheme: AppColorScheme): string {
  return THEME_BACKGROUND[scheme];
}

export async function loadStoredColorScheme(): Promise<AppColorScheme | null> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  if (value === "light" || value === "dark") return value;
  return null;
}

export async function persistColorScheme(scheme: AppColorScheme): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, scheme);
}

/** Apply + persist so NativeWind's dark class and the React hook stay in sync. */
export function applyColorScheme(scheme: AppColorScheme): void {
  nativewindColorScheme.set(scheme);
  void persistColorScheme(scheme);
  void SystemUI.setBackgroundColorAsync(THEME_BACKGROUND[scheme]);
}
