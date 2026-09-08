import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { notificationTarget } from "@/src/features/notifications/navigation";
import type { MobileNotification } from "@/src/features/notifications/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { notificationReferenceLabel } from "@/src/helpers/display";
import { getPrimaryColor } from "@/src/theme";

type Props = {
  item: MobileNotification;
  isNew?: boolean;
  onPress?: (item: MobileNotification) => void;
};

export function NotificationItemCard({ item, isNew = false, onPress }: Props) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const Icon =
    item.category === "campaign"
      ? appIcons.campaign
      : item.category === "donation"
        ? appIcons.myDonations
        : item.category === "help"
          ? appIcons.help
          : item.category === "post"
            ? appIcons.campaign
            : appIcons.notification;
  const actionLabel = notificationReferenceLabel(item);
  const createdAt = item.createdAt ?? item.sentAt;

  const open = () => {
    onPress?.(item);
    router.push(notificationTarget(item) as never);
  };

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      className={`mb-0 border-b border-gray-100 px-3 py-3 dark:border-dark-400 ${
        isNew
          ? "bg-primary-100/70 dark:bg-primary-400/10"
          : "bg-transparent"
      }`}
    >
      <View className="flex-row-reverse items-start gap-3">
        <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-dark-350">
          <Icon size={18} color={primaryColor} strokeWidth={2.25} />
        </View>
        <View className="flex-1">
          <View className="flex-row-reverse items-start justify-between gap-2">
            <Text
              weight="semibold"
              size="sm"
              className="flex-1 text-dark-100 dark:text-light-50"
            >
              {item.title}
            </Text>
            {!item.isRead ? (
              <View className="mt-1.5 h-2.5 w-2.5 rounded-full bg-primary-400" />
            ) : null}
          </View>
          <Text
            size="xs"
            className="mt-1 leading-6 text-gray-600 dark:text-gray-200"
          >
            {item.body}
          </Text>
          <View className="mt-2 flex-row-reverse items-center justify-between">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {createdAt ? formatRelativeDateAr(createdAt) : ""}
            </Text>
            {actionLabel ? (
              <Text size="xs" weight="medium" className="text-primary-400">
                {actionLabel}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
