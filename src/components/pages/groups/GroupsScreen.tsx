import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { FilterCountSlider } from "@/src/components/shared";
import Button from "@/src/components/ui/Button";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { useDiscoverGroups, useMyGroups } from "@/src/features/groups/queries";
import type { Group } from "@/src/features/groups/types";
import { useOnTabReselect } from "@/src/lib/tab-reselect";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { GroupCard } from "./GroupCard";

const tabs = [
  { key: "discover", label: "اكتشف" },
  { key: "joined", label: "مشترك فيها" },
  { key: "owned", label: "مجموعاتي" },
] as const;
type TabKey = (typeof tabs)[number]["key"];

export function GroupsScreen() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const discover = useDiscoverGroups();
  const joined = useMyGroups("joined");
  const owned = useMyGroups("owned");
  const activeQuery = activeTab === "discover" ? discover : activeTab === "joined" ? joined : owned;
  const groups = activeQuery.data ?? [];

  useOnTabReselect("groups", () => void activeQuery.refetch());
  const intro = useMemo(() => activeTab === "discover"
    ? "تصفح الفرق التطوعية النشطة وانضم لما يناسب اهتماماتك."
    : activeTab === "joined"
      ? "الفرق التي أنت عضو فيها حالياً."
      : "الفرق التي أنشأتها أنت، بما فيها الطلبات قيد مراجعة جود أو المرفوضة.", [activeTab]);

  const openCreate = () => {
    if (!requireAuth()) return;
    router.push("/groups/create" as never);
  };

  return (
    <ScrollView className="flex-1 bg-light-100 dark:bg-dark-300" contentContainerStyle={{ padding: 16, paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={activeQuery.isRefetching} onRefresh={() => void activeQuery.refetch()} />}>
      <View className="mb-4 flex-row-reverse items-center justify-between gap-3">
        <View className="flex-1"><Text size="lg" weight="bold">الفرق التطوعية</Text><Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">{intro}</Text></View>
        <Button size="small" onPress={openCreate}>إنشاء فريق</Button>
      </View>

      <FilterCountSlider
        items={tabs}
        selectedKey={activeTab}
        onSelect={(key) => {
          if (key !== "discover" && !requireAuth()) return;
          setActiveTab(key);
        }}
      />

      {activeQuery.isLoading ? <View className="gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></View> : null}
      {!activeQuery.isLoading && groups.length === 0 ? <View className="items-center gap-3 rounded-2xl border border-gray-200 p-8 dark:border-dark-400"><Text size="sm" weight="semibold">لا توجد فرق هنا حالياً</Text>{activeTab === "owned" ? <Button size="small" onPress={openCreate}>أنشئ فريقك الأول</Button> : null}</View> : null}
      <View className="gap-3">{groups.map((group: Group) => <GroupCard key={group.id} group={group} />)}</View>
    </ScrollView>
  );
}
