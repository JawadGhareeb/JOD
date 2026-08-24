import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/src/components/ui/Button";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-300">
        <Logo variant="large" showName />
      </View>
    );
  }

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }}
      className="flex-1 bg-light-100 px-6 dark:bg-dark-300"
    >
      <View className="absolute -right-24 top-16 h-64 w-64 rounded-full bg-primary-100/70 dark:bg-primary-400/10" />
      <View className="absolute -left-28 bottom-28 h-72 w-72 rounded-full bg-primary-100/50 dark:bg-primary-400/10" />

      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <Logo variant="x-large" showName width={210} height={210} />

          <View className="mt-5 items-center gap-2 px-3">
            <Text variant="heading" weight="bold" rtlAlign="center" className="text-primary-400">
              جود..
            </Text>
            <Text
              size="base"
              weight="medium"
              rtlAlign="center"
              className="leading-8 text-dark-100 dark:text-light-50"
            >
              حيث يلتقي الخير بمن يستحقه
            </Text>
            <Text size="xs" rtlAlign="center" className="mt-2 leading-6 text-gray-500 dark:text-gray-300">
              استكشف فرص الخير والمبادرات، وشارك في صنع أثر حقيقي.
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Button
          fullWidth
          size="large"
          onPress={() => router.replace("/(tabs)/home")}
          accessibilityLabel="متابعة كزائر"
        >
          متابعة كزائر
        </Button>
        <Button
          fullWidth
          size="large"
          variant="outline"
          onPress={() => router.push("/(auth)/login")}
          accessibilityLabel="تسجيل الدخول"
        >
          تسجيل الدخول
        </Button>
      </View>
    </View>
  );
}
