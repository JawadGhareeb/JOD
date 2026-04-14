import { Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import type { NotificationItem as NotificationModel, NotificationType } from "@/src/types/notifications";

type NotificationItemCardProps = {
  item: NotificationModel;
};

const iconByType: Record<NotificationType, keyof typeof appIcons> = {
  campaign: "campaign",
  volunteer: "volunteer",
  comment: "comments",
  saved: "savedPosts",
  system: "notification",
};

export function NotificationItemCard({ item }: NotificationItemCardProps) {
  const Icon = appIcons[iconByType[item.type]];

  return (
    <Card
      padding="md"
      className={`mb-3 border ${item.isRead ? "border-gray-200 dark:border-dark-400" : "border-primary-200"}`}
    >
      <View className="flex-row-reverse items-start gap-3">
        <View className="mt-1 h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
          <Icon size={18} color="#405d72" strokeWidth={2.25} />
        </View>

        <View className="flex-1">
          <View className="flex-row-reverse items-center justify-between">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {item.title}
            </Text>
            {!item.isRead ? <View className="h-2.5 w-2.5 rounded-full bg-primary-400" /> : null}
          </View>

          <Text size="xs" className="mt-1 leading-6 text-gray-600 dark:text-gray-200">
            {item.body}
          </Text>

          <View className="mt-3 flex-row-reverse items-center justify-between">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {formatRelativeDateAr(item.createdAt)}
            </Text>

            {item.actionLabel ? (
              <Pressable accessibilityRole="button">
                <Text size="xs" weight="medium" className="text-primary-400">
                  {item.actionLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
}
