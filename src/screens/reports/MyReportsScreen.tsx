import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";
import type { ReportStatus } from "@/src/types/reports";

type ReportFilter = "all" | ReportStatus;

const statusLabel: Record<ReportStatus, string> = {
  new: "جديد",
  in_progress: "قيد المعالجة",
  waiting_response: "بانتظار الرد",
  closed: "مغلق",
};

const statusColor: Record<ReportStatus, string> = {
  new: "text-jod-primary",
  in_progress: "text-jod-warning",
  waiting_response: "text-jod-accent",
  closed: "text-jod-success",
};

export const MyReportsScreen = () => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ReportFilter>("all");
  const { reports, blockedEntities } = useAppData();

  const visibleReports = useMemo(() => {
    if (filter === "all") return reports;
    return reports.filter((report) => report.status === filter);
  }, [filter, reports]);

  return (
    <View className="flex-1 bg-jod-background" style={{ paddingTop: insets.top + 8 }}>
      <View className="gap-3 px-4">
        <Text className="text-right font-noto-bold text-xl text-jod-text">بلاغاتي</Text>
        <Text className="text-right font-noto text-xs text-jod-muted">
          العناصر المحظورة: {blockedEntities.length}
        </Text>

        <View className="flex-row-reverse flex-wrap gap-2">
          <FilterPill label="الكل" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterPill
            label="جديد"
            active={filter === "new"}
            onPress={() => setFilter("new")}
          />
          <FilterPill
            label="قيد المعالجة"
            active={filter === "in_progress"}
            onPress={() => setFilter("in_progress")}
          />
          <FilterPill
            label="بانتظار الرد"
            active={filter === "waiting_response"}
            onPress={() => setFilter("waiting_response")}
          />
          <FilterPill
            label="مغلق"
            active={filter === "closed"}
            onPress={() => setFilter("closed")}
          />
        </View>
      </View>

      <FlatList
        data={visibleReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
          gap: 12,
        }}
        renderItem={({ item }) => (
          <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
            <View className="flex-row-reverse items-center justify-between">
              <Text className={`font-noto-semibold text-xs ${statusColor[item.status]}`}>
                {statusLabel[item.status]}
              </Text>
              <Text className="font-noto text-xs text-jod-muted">
                {new Date(item.createdAt).toLocaleDateString("ar-SA")}
              </Text>
            </View>
            <Text className="text-right font-noto-bold text-sm text-jod-text">{item.title}</Text>
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              {item.description}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="rounded-xl border border-jod-border bg-jod-surface p-8">
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              لا توجد بلاغات مطابقة للحالة.
            </Text>
          </View>
        }
      />
    </View>
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
