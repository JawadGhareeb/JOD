import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { notificationTarget } from "@/src/features/notifications/navigation";
import type { MobileNotification } from "@/src/features/notifications/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

type Props = {
  item: MobileNotification;
  onPress?: (item: MobileNotification) => void;
};

export function NotificationItemCard({ item, onPress }: Props) {
  const router = useRouter();
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
  const actionLabel =
    item.referenceLabel ?? item.actionLabel ?? item.action?.label ?? null;
  const createdAt = item.createdAt ?? item.sentAt;

  const open = () => {
    onPress?.(item);
    router.push(notificationTarget(item) as never);
  };

  return (
    <Card
      padding="md"
      className={`mb-3 border ${
        item.isRead
          ? "border-gray-200 dark:border-dark-400"
          : "border-primary-200"
      }`}
      onPress={open}
      accessibilityRole="button"
    >
      <View className="flex-row-reverse items-start gap-3">
        <View className="mt-1 h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
          <Icon size={18} color="#405d72" strokeWidth={2.25} />
        </View>
        <View className="flex-1">
          <View className="flex-row-reverse items-start justify-between gap-2">
            <View className="flex-1">
              <Text
                weight="semibold"
                size="sm"
                className="text-dark-100 dark:text-light-50"
              >
                {item.title}
              </Text>
              {item.priority === "high" ? (
                <View className="mt-1 self-end rounded-full bg-error-300/10 px-2 py-0.5">
                  <Text size="2xs" weight="medium" className="text-error-300">
                    أولوية عالية
                  </Text>
                </View>
              ) : null}
            </View>
            {!item.isRead ? (
              <View className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-400" />
            ) : null}
          </View>
          <Text
            size="xs"
            className="mt-1 leading-6 text-gray-600 dark:text-gray-200"
          >
            {item.body}
          </Text>
          <View className="mt-3 flex-row-reverse items-center justify-between">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {createdAt ? formatRelativeDateAr(createdAt) : ""}
            </Text>
            {actionLabel ? (
              <Pressable onPress={open}>
                <Text size="xs" weight="medium" className="text-primary-400">
                  {actionLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
}
