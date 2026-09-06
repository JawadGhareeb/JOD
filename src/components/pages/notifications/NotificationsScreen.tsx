import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { SectionList, View } from "react-native";
import Text from "@/src/components/ui/Text";
import {
  useMarkAllNotificationsRead,
  useNotifications,
} from "@/src/features/notifications/queries";
import type { MobileNotification } from "@/src/features/notifications/types";
import { useOnTabReselect } from "@/src/lib/tab-reselect";
import { NotificationItemCard } from "./NotificationItemCard";
import { NotificationItemCardSkeleton } from "./NotificationItemCardSkeleton";

type NotificationSection = {
  title: string;
  key: "new" | "earlier";
  data: MobileNotification[];
};

export function NotificationsScreen() {
  const query = useNotifications({});
  const markAll = useMarkAllNotificationsRead();
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const markingRef = useRef(false);
  const listRef = useRef<SectionList<MobileNotification, NotificationSection>>(null);
  const refetch = query.refetch;
  const markAllRead = markAll.mutateAsync;

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void (async () => {
        const result = await refetch();
        if (!active) return;

        const list = result.data?.pages.flatMap((page) => page.items) ?? [];
        setNewIds(new Set(list.filter((item) => !item.isRead).map((item) => item.id)));

        if (markingRef.current) return;
        markingRef.current = true;
        try {
          await markAllRead();
        } catch {
          // Badge clear is best-effort; keep the inbox usable.
        } finally {
          markingRef.current = false;
        }
      })();

      return () => {
        active = false;
      };
    }, [markAllRead, refetch]),
  );

  const sections = useMemo<NotificationSection[]>(() => {
    const newer = items.filter((item) => newIds.has(item.id));
    const earlier = items.filter((item) => !newIds.has(item.id));
    const next: NotificationSection[] = [];
    if (newer.length > 0) next.push({ title: "جديد", key: "new", data: newer });
    if (earlier.length > 0) next.push({ title: "سابقاً", key: "earlier", data: earlier });
    return next;
  }, [items, newIds]);

  useOnTabReselect("notifications", () => {
    if (sections.length > 0 && sections[0]?.data.length) {
      listRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: true,
        viewOffset: 0,
      });
    }
    void refetch();
  });

  return (
    <View className="flex-1 bg-light-100 px-4 pt-3 dark:bg-dark-300">
      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItemCard item={item} />}
        renderSectionHeader={({ section }) => (
          <View className="mb-2 mt-1 bg-light-100 pb-1 dark:bg-dark-300">
            <Text weight="bold" size="sm" className="text-dark-100 dark:text-light-50">
              {section.title}
            </Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void refetch()}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) {
            void query.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          query.isLoading ? (
            <View className="pt-1">
              <NotificationItemCardSkeleton />
              <NotificationItemCardSkeleton />
              <NotificationItemCardSkeleton />
            </View>
          ) : (
            <View className="items-center py-8">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                لا توجد إشعارات حالياً.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? <NotificationItemCardSkeleton /> : null
        }
      />
    </View>
  );
}
