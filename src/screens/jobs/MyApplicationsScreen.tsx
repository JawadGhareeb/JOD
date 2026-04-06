import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";

type JobApplicationFilter = "all" | "submitted" | "in_review" | "accepted" | "rejected";

const statusLabel = {
  submitted: "تم الإرسال",
  in_review: "قيد المراجعة",
  accepted: "مقبول",
  rejected: "مرفوض",
} as const;

const statusColor = {
  submitted: "text-jod-primary",
  in_review: "text-jod-warning",
  accepted: "text-jod-success",
  rejected: "text-jod-danger",
} as const;

export const MyApplicationsScreen = () => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<JobApplicationFilter>("all");
  const { jobApplications, jobs } = useAppData();

  const items = useMemo(() => {
    const mapped = jobApplications
      .map((application) => {
        const job = jobs.find((item) => item.id === application.jobId);
        if (!job) return null;
        return { application, job };
      })
      .filter(Boolean) as {
      application: (typeof jobApplications)[number];
      job: (typeof jobs)[number];
    }[];

    if (filter === "all") return mapped;
    return mapped.filter((item) => item.application.status === filter);
  }, [filter, jobApplications, jobs]);

  return (
    <View className="flex-1 bg-jod-background" style={{ paddingTop: insets.top + 8 }}>
      <View className="gap-3 px-4">
        <Text className="text-right font-noto-bold text-xl text-jod-text">
          طلباتي الوظيفية
        </Text>

        <View className="flex-row-reverse flex-wrap gap-2">
          <FilterPill
            label="الكل"
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <FilterPill
            label="تم الإرسال"
            active={filter === "submitted"}
            onPress={() => setFilter("submitted")}
          />
          <FilterPill
            label="قيد المراجعة"
            active={filter === "in_review"}
            onPress={() => setFilter("in_review")}
          />
          <FilterPill
            label="مقبول"
            active={filter === "accepted"}
            onPress={() => setFilter("accepted")}
          />
          <FilterPill
            label="مرفوض"
            active={filter === "rejected"}
            onPress={() => setFilter("rejected")}
          />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.application.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
          gap: 12,
        }}
        renderItem={({ item }) => (
          <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
            <Text className="text-right font-noto-bold text-sm text-jod-text">
              {item.job.title}
            </Text>
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              {item.job.orgName} - {item.job.city}
            </Text>
            <Text className="text-right font-noto text-xs text-jod-muted">
              تاريخ التقديم:{" "}
              {new Date(item.application.appliedAt).toLocaleDateString("ar-SA")}
            </Text>
            <Text
              className={`text-right font-noto-semibold text-sm ${statusColor[item.application.status]}`}
            >
              الحالة: {statusLabel[item.application.status]}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-xl border border-jod-border bg-jod-surface p-8">
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              لا توجد طلبات مطابقة للحالة المختارة.
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
