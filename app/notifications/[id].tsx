import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import {
  useMarkNotificationRead,
  useMarkNotificationUnread,
  useNotification,
} from "@/src/features/notifications/queries";
import { notificationReferenceTarget } from "@/src/features/notifications/navigation";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

export default function NotificationDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const notificationId = Array.isArray(id) ? id[0] : id;
  const query = useNotification(notificationId);
  const markRead = useMarkNotificationRead();
  const markUnread = useMarkNotificationUnread();
  const item = query.data;
  const linkedTarget = item ? notificationReferenceTarget(item) : null;
  const busy = markRead.isPending || markUnread.isPending;

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تفاصيل الإشعار" />
      {query.isLoading ? (
        <View className="gap-2">
          <CardSkeleton height={120} margin={0} />
          <CardSkeleton height={220} margin={0} />
        </View>
      ) : query.isError || !item ? (
        <Card padding="md" className="border-gray-200 dark:border-dark-400">
          <Text size="sm" rtlAlign="center" className="text-error-300">
            تعذر تحميل تفاصيل الإشعار.
          </Text>
        </Card>
      ) : (
        <View className="gap-2">
          <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-start justify-between gap-2">
              <View className="flex-1">
                <Text weight="semibold" size="base" className="text-dark-100 dark:text-light-50">
                  {item.title}
                </Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  {item.createdAt || item.sentAt
                    ? formatRelativeDateAr(item.createdAt ?? item.sentAt!)
                    : ""}
                </Text>
              </View>
              <View className={`rounded-full px-3 py-1 ${item.isRead ? "bg-gray-100 dark:bg-dark-350" : "bg-primary-400/10"}`}>
                <Text size="2xs" weight="medium" className={item.isRead ? "text-gray-500 dark:text-gray-300" : "text-primary-400"}>
                  {item.isRead ? "مقروء" : "غير مقروء"}
                </Text>
              </View>
            </View>
          </Card>

          <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
            <Text size="sm" className="leading-7 text-dark-100 dark:text-light-50">
              {item.body}
            </Text>
            <View className="border-t border-gray-100 pt-3 dark:border-dark-400">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                التصنيف: {item.category || "-"}
              </Text>
              {item.eventType ? (
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  النوع: {item.eventType}
                </Text>
              ) : null}
            </View>
          </Card>

          <Button
            fullWidth
            variant="tertiary"
            disabled={busy}
            loading={busy}
            onPress={() => {
              if (item.isRead) markUnread.mutate(item.id);
              else markRead.mutate(item.id);
            }}
          >
            {item.isRead ? "تعيين كغير مقروء" : "تعيين كمقروء"}
          </Button>

          {linkedTarget ? (
            <Button fullWidth onPress={() => router.push(linkedTarget as never)}>
              {item.referenceLabel ?? item.actionLabel ?? item.action?.label ?? "فتح العنصر المرتبط"}
            </Button>
          ) : null}
        </View>
      )}
    </View>
  );
}
