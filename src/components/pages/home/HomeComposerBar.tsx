import { useRouter } from "expo-router";
import { ImagePlus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { getPrimaryColor } from "@/src/theme";

export function HomeComposerBar() {
  const router = useRouter();
  const { user } = useAuthStatus();
  const { requireAuth } = useAuthGuard();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  const openComposer = () => {
    if (!requireAuth()) return;
    router.push("/create-post");
  };

  const openProfile = () => {
    if (!requireAuth()) return;
    router.push("/(tabs)/profile");
  };

  return (
    <Card padding="sm" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="flex-row-reverse items-center gap-2">
        <Pressable onPress={openProfile} accessibilityRole="button" accessibilityLabel="فتح الملف الشخصي" className="rounded-full">
          <Avatar name={user?.name || "زائر"} size={38} />
        </Pressable>
        <Pressable
          onPress={openComposer}
          className="h-10 flex-1 justify-center rounded-full bg-gray-100 px-4 dark:bg-dark-350"
          accessibilityRole="button"
          accessibilityLabel="نشر بوست جديد"
        >
          <Text size="sm" className="text-gray-500 dark:text-gray-300">بماذا تفكّر؟</Text>
        </Pressable>
        <Pressable
          onPress={openComposer}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-350"
          accessibilityRole="button"
          accessibilityLabel="إضافة صورة للمنشور"
        >
          <ImagePlus size={20} color={primaryColor} strokeWidth={2.25} />
        </Pressable>
      </View>
    </Card>
  );
}
