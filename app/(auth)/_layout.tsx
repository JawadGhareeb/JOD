import { useRTL } from "@/providers/RTLProvider";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { isRTL } = useRTL();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: isRTL ? "slide_from_left" : "slide_from_right",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="reset-password/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="verify-code/index" options={{ headerShown: false }} />
    </Stack>
  );
}
