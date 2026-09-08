import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import { FilterCountSlider } from "@/src/components/shared";
import Button from "@/src/components/ui/Button";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { useDiscoverGroups, useMyGroups } from "@/src/features/groups/queries";
import type { Group } from "@/src/features/groups/types";
import { useOnTabReselect } from "@/src/lib/tab-reselect";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { getPrimaryColor } from "@/src/theme";
import { GroupCard } from "./GroupCard";

const GroupsIcon = appIcons.groups;

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
  const emptyMessage = activeTab === "discover"
    ? "لا توجد فرق تطوعية لعرضها."
    : activeTab === "joined"
      ? "لم تنضم إلى أي فريق تطوعي بعد."
      : "لم تنشئ أي فريق تطوعي بعد.";

  const openCreate = () => {
    if (!requireAuth()) return;
    router.push("/groups/create" as never);
  };

  return (
    <ScrollView className="flex-1 bg-light-100 dark:bg-dark-300" contentContainerStyle={{ padding: 16, paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={activeQuery.isRefetching} onRefresh={() => void activeQuery.refetch()} />}>
        <View className="flex-1 gap-2 mb-2"><Text size="lg" weight="bold">الفرق التطوعية</Text><Text size="2xs" className=" text-gray-500 dark:text-gray-300">{intro}</Text></View>

      <FilterCountSlider
        items={tabs}
        selectedKey={activeTab}
        onSelect={(key) => {
          if (key !== "discover" && !requireAuth()) return;
          setActiveTab(key);
        }}
      />

      {activeQuery.isLoading ? <View className="gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></View> : null}
      {!activeQuery.isLoading && groups.length === 0 ? (
        <GroupsEmptyState
          message={emptyMessage}
          onCreate={openCreate}
          onExplore={() => {
            if (activeTab === "discover") {
              void activeQuery.refetch();
              return;
            }
            setActiveTab("discover");
          }}
        />
      ) : null}
      <View className="gap-3">{groups.map((group: Group) => <GroupCard key={group.id} group={group} />)}</View>
    </ScrollView>
  );
}

function GroupsEmptyState({
  message,
  onCreate,
  onExplore,
}: {
  message: string;
  onCreate: () => void;
  onExplore: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  return (
    <View className="gap-3 py-8">
      <View className="w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-dark-400 dark:bg-dark-500">
        <View className="size-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-dark-350">
          <GroupsIcon size={28} color={primaryColor} strokeWidth={2} />
        </View>
        <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
          {message}
        </Text>
      </View>
      <View className="gap-2">
        <Button fullWidth size="small" onPress={onCreate}>
          إنشاء فريق تطوعي
        </Button>
        <Button fullWidth size="small" variant="tertiary" onPress={onExplore}>
          تصفح الفرق التطوعية
        </Button>
      </View>
    </View>
  );
}
