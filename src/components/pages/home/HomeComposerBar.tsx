import { useRouter } from "expo-router";
import { ImagePlus } from "lucide-react-native";
import { Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { useAuthStatus } from "@/src/features/auth/queries";

// Facebook-style composer prompt — tapping it (or the image icon) just opens
// the full create-post screen, same as tapping FB's own composer bar does.
export function HomeComposerBar() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStatus();

  if (!isAuthenticated) return null;

  const openComposer = () => router.push("/(tabs)/create-post");

  return (
    <Card padding="sm" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="flex-row-reverse items-center gap-2">
        <Avatar name={user?.name || ""} size={38} />
        <Pressable
          onPress={openComposer}
          className="h-10 flex-1 justify-center rounded-full bg-gray-100 px-4 dark:bg-dark-350"
          accessibilityRole="button"
          accessibilityLabel="نشر بوست جديد"
        >
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            بشو عم تفكر؟
          </Text>
        </Pressable>
        <Pressable
          onPress={openComposer}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-350"
          accessibilityRole="button"
          accessibilityLabel="إضافة صورة للمنشور"
        >
          <ImagePlus size={20} color="#405d72" strokeWidth={2.25} />
        </Pressable>
      </View>
    </Card>
  );
}
