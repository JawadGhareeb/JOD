import { Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { MapPin, Pencil } from "lucide-react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import type { ProfileSummary } from "@/src/types/profile";
import { appIcons } from "@/src/components/layout/iconMap";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { useUpdateAvatar } from "@/src/features/auth/queries";
import { useToast } from "@/src/providers/ToastProvider";

const NotificationIcon = appIcons.notification;
const SettingsIcon = appIcons.settings;
const BioIcon = appIcons.about;

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

  return (
    <Card padding="none" className="mb-4 overflow-hidden border-gray-200 dark:border-dark-400">
      <View className="h-28 bg-primary-400/20 dark:bg-primary-400/10" />

      <View className="items-center px-4 pb-5">
        <Pressable
          onPress={() => void changeAvatar()}
          disabled={updateAvatarMutation.isPending}
          className="-mt-12 rounded-full border-4 border-white bg-white dark:border-dark-500 dark:bg-dark-500"
          accessibilityLabel="تغيير صورة الملف الشخصي"
        >
          <Avatar name={summary.name} imageUrl={summary.avatarUrl} size={96} />
          <View className="absolute bottom-0 right-0 size-8 items-center justify-center rounded-full border-2 border-white bg-primary-400 dark:border-dark-500">
            <Pencil size={14} color="#FFFFFF" />
          </View>
        </Pressable>

        <View className="mt-3 flex-row-reverse items-center gap-1.5">
          <Text weight="bold" size="xl" className="text-dark-100 dark:text-light-50">{summary.name}</Text>
          {summary.verified ? <VerifiedBadge /> : null}
        </View>

        <Text size="sm" className="mt-1 text-gray-500 dark:text-gray-300">
          @{summary.username} · {summary.stats.postsCount} منشورات
        </Text>

        {summary.city || summary.bio ? (
          <View className="mt-3 w-full gap-2">
            {summary.city ? (
              <View className="flex-row-reverse items-center gap-2">
                <MapPin size={15} color="#9CA3AF" strokeWidth={2.25} />
                <Text size="xs" className="text-gray-600 dark:text-gray-300">{summary.city}</Text>
              </View>
            ) : null}
            {summary.bio ? (
              <View className="flex-row-reverse items-start gap-2">
                <View className="mt-0.5"><BioIcon size={15} color="#9CA3AF" strokeWidth={2.25} /></View>
                <Text size="xs" className="flex-1 leading-6 text-gray-600 dark:text-gray-300">{summary.bio}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View className="mt-4 w-full flex-row-reverse gap-2 border-t border-gray-100 pt-4 dark:border-dark-400">
          {(Object.keys(statLabels) as (keyof typeof statLabels)[]).map((key) => (
            <View key={key} className="flex-1 items-center rounded-2xl bg-primary-100/70 py-3 dark:bg-dark-350">
              <Text weight="bold" size="base" className="text-primary-400">{summary.stats[key]}</Text>
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">{statLabels[key]}</Text>
            </View>
          ))}
        </View>

        <View className="mt-3 w-full flex-row-reverse gap-2">
          <View className="flex-1">
            <Button
              fullWidth
              size="small"
              variant="tertiary"
              leftIcon={<Pencil size={16} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.25} />}
              onPress={() => router.push("/edit-information")}
            >
              تعديل الملف الشخصي
            </Button>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/settings")} className="size-11 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350" accessibilityLabel="الإعدادات">
            <SettingsIcon size={19} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.2} />
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/notifications")} className="size-11 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350" accessibilityLabel="الإشعارات">
            <NotificationIcon size={19} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
