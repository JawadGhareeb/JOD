import { useRTL } from "@/providers/RTLProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { isRTL } = useRTL();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: isRTL ? "slide_from_left" : "slide_from_right",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="posts/create/index" options={{ headerShown: false }} />
      <Stack.Screen name="applications/index" options={{ headerShown: false }} />
      <Stack.Screen name="campaign-results/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="publisher/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="donation/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="volunteer/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="job/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
