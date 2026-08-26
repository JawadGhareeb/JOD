import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/src/features/notifications/queries";
import { NotificationItemCard } from "./NotificationItemCard";

type InboxFilter = "all" | "unread";

export function NotificationsScreen() {
  const [filter, setFilter] = useState<InboxFilter>("all");
  const query = useNotifications({ status: filter === "unread" ? "unread" : undefined });
  const unreadQuery = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );
  const unreadCount = unreadQuery.data ?? 0;

  return (
    <View className="flex-1 bg-light-100 px-4 pt-3 dark:bg-dark-300">
      <View className="mb-3 flex-row-reverse items-center justify-between">
        <View className="flex-row-reverse gap-2">
          <Pressable
            onPress={() => setFilter("all")}
            className={`rounded-full border px-4 py-2 ${
              filter === "all"
                ? "border-primary-400 bg-primary-400/10"
                : "border-gray-200 dark:border-dark-400"
            }`}
          >
            <Text
              size="2xs"
              weight="medium"
              className={filter === "all" ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              الكل
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter("unread")}
            className={`rounded-full border px-4 py-2 ${
              filter === "unread"
                ? "border-primary-400 bg-primary-400/10"
                : "border-gray-200 dark:border-dark-400"
            }`}
          >
            <Text
              size="2xs"
              weight="medium"
              className={filter === "unread" ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              غير المقروءة{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Text>
          </Pressable>
        </View>

        <Pressable
          disabled={unreadCount === 0 || markAll.isPending}
          onPress={() => markAll.mutate()}
        >
          <Text
            size="2xs"
            className={unreadCount > 0 ? "text-primary-400" : "text-gray-400"}
          >
            قراءة الكل
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItemCard
            item={item}
            onPress={(notification) => {
              if (!notification.isRead) markRead.mutate(notification.id);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void query.refetch()}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) {
            void query.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          query.isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator />
              <Text size="xs" className="mt-2 text-gray-500 dark:text-gray-300">
                جارِ تحميل الإشعارات...
              </Text>
            </View>
          ) : (
            <View className="items-center py-8">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                {filter === "unread"
                  ? "لا توجد إشعارات غير مقروءة."
                  : "لا توجد إشعارات حالياً."}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null
        }
      />
    </View>
  );
}
