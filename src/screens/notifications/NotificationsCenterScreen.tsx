import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import type { NotificationCategory, NotificationDateFilter } from "@/src/types/notifications";

const categoryLabel: Record<"all" | NotificationCategory, string> = {
  all: "الكل",
  campaign: "الحملات",
  post: "المنشورات",
  report: "البلاغات",
  system: "النظام",
};

const isWithinDateFilter = (dateString: string, filter: NotificationDateFilter) => {
  if (filter === "all") return true;

  const date = new Date(dateString);
  const now = new Date();

  if (filter === "today") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  return date >= sevenDaysAgo;
};

export const NotificationsCenterScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<"all" | NotificationCategory>("all");
  const [dateFilter, setDateFilter] = useState<NotificationDateFilter>("all");

  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    notificationPreferences,
  } = useAppData();

  const visibleItems = useMemo(() => {
    return notifications.filter((item) => {
      if (!notificationPreferences[item.category]) return false;
      if (category !== "all" && item.category !== category) return false;
      if (!isWithinDateFilter(item.createdAt, dateFilter)) return false;
      return true;
    });
  }, [category, dateFilter, notifications, notificationPreferences]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const openReference = (item: (typeof notifications)[number]) => {
    markNotificationRead(item.id);

    if (!item.referenceType || !item.referenceId) return;

    if (item.referenceType === "donation") {
      router.push(ROUTES.donationDetails(item.referenceId));
      return;
    }
    if (item.referenceType === "volunteer") {
      router.push(ROUTES.volunteerDetails(item.referenceId));
      return;
    }
    if (item.referenceType === "job") {
      router.push(ROUTES.jobDetails(item.referenceId));
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-jod-background"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 px-4">
        <View className="flex-row-reverse items-center justify-between">
          <Text className="text-right font-noto-bold text-xl text-jod-text">
            الإشعارات
          </Text>
          <Pressable
            className="rounded-full border border-jod-border bg-jod-surface px-3 py-2"
            onPress={() => router.push(ROUTES.notificationPreferences)}
          >
            <Text className="font-noto-semibold text-xs text-jod-text">التفضيلات</Text>
          </Pressable>
        </View>

        <View className="rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto text-sm text-jod-text-secondary">
            غير مقروء: {unreadCount}
          </Text>
          <Text className="text-right font-noto text-xs text-jod-muted">
            وضع عدم الإزعاج: {notificationPreferences.doNotDisturb ? "مفعّل" : "غير مفعّل"}
          </Text>
          <Pressable
            className="mt-3 items-center justify-center rounded-lg border border-jod-border px-3 py-2"
            onPress={markAllNotificationsRead}
          >
            <Text className="font-noto-semibold text-xs text-jod-text">تعيين الكل كمقروء</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <View className="flex-row-reverse flex-wrap gap-2">
            {(["all", "campaign", "post", "report", "system"] as const).map((item) => (
              <FilterPill
                key={item}
                label={categoryLabel[item]}
                active={category === item}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>

          <View className="flex-row-reverse gap-2">
            <FilterPill
              label="كل الفترات"
              active={dateFilter === "all"}
              onPress={() => setDateFilter("all")}
            />
            <FilterPill
              label="اليوم"
              active={dateFilter === "today"}
              onPress={() => setDateFilter("today")}
            />
            <FilterPill
              label="آخر 7 أيام"
              active={dateFilter === "last_7_days"}
              onPress={() => setDateFilter("last_7_days")}
            />
          </View>
        </View>

        {visibleItems.length === 0 ? (
          <View className="rounded-xl border border-jod-border bg-jod-surface p-8">
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              لا توجد إشعارات مطابقة للفلاتر الحالية.
            </Text>
          </View>
        ) : null}

        {visibleItems.map((item) => (
          <Pressable
            key={item.id}
            className={`gap-1 rounded-xl border p-4 ${
              item.isRead
                ? "border-jod-border bg-jod-surface"
                : "border-jod-primary bg-[#ECF8F0]"
            }`}
            onPress={() => openReference(item)}
          >
            <View className="flex-row-reverse items-center justify-between">
              <Text className="font-noto-semibold text-xs text-jod-primary">
                {categoryLabel[item.category]}
              </Text>
              <Text className="font-noto text-xs text-jod-muted">
                {new Date(item.createdAt).toLocaleDateString("ar-SA")}
              </Text>
            </View>
            <Text className="text-right font-noto-bold text-sm text-jod-text">
              {item.title}
            </Text>
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              {item.body}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const FilterPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    className={`rounded-full border px-3 py-2 ${
      active
        ? "border-jod-primary bg-jod-primary"
        : "border-jod-border bg-jod-surface"
    }`}
    onPress={onPress}
  >
    <Text
      className={`font-noto-semibold text-xs ${
        active ? "text-white" : "text-jod-text-secondary"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);
