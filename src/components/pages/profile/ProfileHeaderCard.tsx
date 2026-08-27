import { Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import type { ProfileSummary } from "@/src/types/profile";
import { appIcons } from "@/src/components/layout/iconMap";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { useUpdateAvatar } from "@/src/features/auth/queries";
import { useToast } from "@/src/providers/ToastProvider";

const NotificationIcon = appIcons.notification;
const SettingsIcon = appIcons.settings;
const CreatePostIcon = appIcons.createPost;

const statLabels = {
  postsCount: "المنشورات",
  savedCount: "المحفوظات",
  donationsCount: "تبرعاتي",
} as const;

export function ProfileHeaderCard({ summary }: { summary: ProfileSummary }) {
  const router = useRouter();
  const updateAvatarMutation = useUpdateAvatar();
  const toast = useToast();
  const changeAvatar = async () => {
    if (updateAvatarMutation.isPending) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      toast.error("اسمح للتطبيق بالوصول إلى الصور لتغيير صورة الملف الشخصي.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    try {
      await updateAvatarMutation.mutateAsync({ uri: asset.uri, name: asset.fileName ?? `avatar-${Date.now()}.jpg`, type: asset.mimeType ?? "image/jpeg" });
      toast.success("تم تحديث صورة الملف الشخصي.");
    } catch {
      toast.error("تعذر تحديث صورة الملف الشخصي. حاول مرة أخرى.");
    }
  };
  const metaParts = [`@${summary.username}`, summary.city].filter(Boolean);

  return (
    <Card padding="none" className="mb-4 overflow-hidden border-gray-200 dark:border-dark-400">
      <View className="h-20 bg-primary-400/15" />
      <View className="px-4 pb-4">
        <View className="-mt-10 flex-row-reverse items-end justify-between">
          <Pressable onPress={() => void changeAvatar()} disabled={updateAvatarMutation.isPending} className="rounded-full border-4 border-white bg-white dark:border-dark-500 dark:bg-dark-500" accessibilityLabel="تغيير صورة الملف الشخصي">
            <Avatar name={summary.name} imageUrl={summary.avatarUrl} size={76} />
            <View className="absolute bottom-0 right-0 size-7 items-center justify-center rounded-full bg-primary-400"><Pencil size={13} color="#FFFFFF" /></View>
          </Pressable>
          <View className="mb-1 flex-row-reverse items-center gap-2">
            <Pressable onPress={() => router.push("/(tabs)/create-post")} className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350" accessibilityLabel="إضافة منشور"><CreatePostIcon size={19} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.2} /></Pressable>
            <Pressable onPress={() => router.push("/(tabs)/settings")} className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350" accessibilityLabel="الإعدادات"><SettingsIcon size={19} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.2} /></Pressable>
            <Pressable onPress={() => router.push("/(tabs)/notifications")} className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350" accessibilityLabel="الإشعارات">
              <NotificationIcon size={19} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.2} />
            </Pressable>
            <Pressable onPress={() => router.push("/edit-information")} className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350" accessibilityLabel="تعديل الملف الشخصي">
              <Pencil size={18} color={PRIMARY_COLOR_LIGHT} />
            </Pressable>
          </View>
        </View>

        <View className="mt-3 items-end">
          <View className="flex-row-reverse items-center gap-1.5">
            <Text weight="bold" size="lg" className="text-dark-100 dark:text-light-50">{summary.name}</Text>
            {summary.verified ? <Text size="2xs" weight="semibold" className="text-primary-400">موثق</Text> : null}
          </View>
          {metaParts.length > 0 ? <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">{metaParts.join(" • ")}</Text> : null}
          {summary.bio ? <Text size="sm" className="mt-3 text-right leading-6 text-gray-600 dark:text-gray-200">{summary.bio}</Text> : null}
        </View>

        <View className="mt-4 flex-row-reverse gap-2 border-t border-gray-100 pt-3 dark:border-dark-400">
          {(Object.keys(statLabels) as (keyof typeof statLabels)[]).map((key) => (
            <View key={key} className="flex-1 items-center rounded-2xl bg-primary-100/70 py-3 dark:bg-dark-350">
              <Text weight="bold" size="base" className="text-primary-400">{summary.stats[key]}</Text>
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">{statLabels[key]}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
