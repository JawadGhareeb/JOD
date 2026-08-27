import { useSegments } from "expo-router";
import { View } from "react-native";
import { AppHeader } from "./AppHeader";

function shouldShowAppHeader(segments: string[]): boolean {
  const root = segments[0];
  if (!root || root === "index") return false;
  if (root === "(auth)") return false;
  return true;
}

/** Persistent app chrome — AppHeader on every screen except auth and the index redirect. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const showHeader = shouldShowAppHeader(segments);

  return (
    <View className="flex-1">
      {showHeader ? <AppHeader /> : null}
      <View className="flex-1">{children}</View>
    </View>
  );
}
