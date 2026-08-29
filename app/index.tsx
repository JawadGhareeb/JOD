import { Redirect, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeInUp } from "@/src/components/shared/FadeInUp";
import Button from "@/src/components/ui/Button";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-300">
        <ActivityIndicator size="small" color="#4A9782" />
      </View>
    );
  }

  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;

  return (
    <View style={{ paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }} className="flex-1 overflow-hidden bg-light-100 px-6 dark:bg-dark-300">
      <View className="absolute -right-24 top-12 h-64 w-64 rounded-full bg-primary-100/70 dark:bg-primary-400/10" />
      <View className="absolute -left-28 bottom-24 h-72 w-72 rounded-full bg-primary-100/50 dark:bg-primary-400/10" />
      <View className="flex-1 items-center justify-center">
        <FadeInUp>
          <View className="items-center">
            <Logo variant="x-large" showName width={180} height={180} />
            <View className="mt-5 items-center gap-2 px-3">
              <Text variant="heading" weight="bold" rtlAlign="center" className="text-primary-400">جود</Text>
              <Text size="base" weight="medium" rtlAlign="center" className="leading-8 text-dark-100 dark:text-light-50">حيث يلتقي الخير بمن يستحقه</Text>
              <Text size="xs" rtlAlign="center" className="mt-1 max-w-[320px] leading-6 text-gray-500 dark:text-gray-300">استكشف فرص الخير والمبادرات وشارك في صنع أثر حقيقي.</Text>
            </View>
          </View>
        </FadeInUp>
      </View>
      <FadeInUp delay={130}>
        <View className="w-full max-w-[320px] self-center gap-2.5">
          <Button fullWidth size="medium" onPress={() => router.push("/(auth)/login")}>تسجيل الدخول</Button>
          <Button fullWidth size="medium" variant="outline" onPress={() => router.push("/(auth)/register")}>إنشاء حساب</Button>
          <Pressable onPress={() => router.replace("/(tabs)/home")} className="items-center py-2" accessibilityRole="button"><Text size="xs" weight="semibold" className="text-primary-400">التصفح كزائر</Text></Pressable>
        </View>
      </FadeInUp>
    </View>
  );
}
