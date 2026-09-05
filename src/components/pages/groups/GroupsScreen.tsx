import { useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { useColorScheme } from "nativewind";
import { Plus } from "lucide-react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import {
  useDiscoverGroups,
  useMyGroups,
  useSuggestedGroups,
} from "@/src/features/groups/queries";
import type { Group } from "@/src/features/groups/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { getPrimaryColor } from "@/src/theme";
import { GroupCard } from "./GroupCard";

const GroupsIcon = appIcons.groups;

type GroupsTab = "forYou" | "myGroups" | "discover";

const TABS: { key: GroupsTab; label: string }[] = [
  { key: "forYou", label: "لك" },
  { key: "myGroups", label: "مجموعاتي" },
  { key: "discover", label: "اكتشف" },
];

const TAB_META: Record<GroupsTab, { intro: string; empty: string; showJoin: boolean }> = {
  forYou: {
    intro: "فرق تطوعية مقترحة لك",
    empty: "لا توجد اقتراحات حالياً.",
    showJoin: true,
  },
  myGroups: {
    intro: "الفرق التطوعية التي انضممت إليها",
    empty: "لم تنضم إلى أي فريق تطوعي بعد.",
    showJoin: false,
  },
  discover: {
    intro: "تصفّح الفرق التطوعية",
    empty: "لا توجد فرق تطوعية لعرضها.",
    showJoin: true,
  },
};

export function GroupsScreen() {
  const [activeTab, setActiveTab] = useState<GroupsTab>("forYou");

  const suggested = useSuggestedGroups();
  const mine = useMyGroups();
  const discover = useDiscoverGroups();

  const query = activeTab === "forYou" ? suggested : activeTab === "myGroups" ? mine : discover;
  const { intro, empty, showJoin } = TAB_META[activeTab];
  const groups: Group[] = query.data ?? [];

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <GroupsTabBar activeTab={activeTab} onChange={setActiveTab} />

      <FlatList
        // Remount on tab change so the list scrolls back to the top.
        key={activeTab}
        className="flex-1 px-4"
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroupCard group={item} showJoin={showJoin} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
        ListHeaderComponent={
          <View className="gap-2">
            {activeTab === "myGroups" && groups.length > 0 ? <CreateGroupCta /> : null}
            {groups.length > 0 ? (
              <Text size="2xs" className="mb-1 text-gray-500 dark:text-gray-300">
                {intro}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          query.isLoading ? (
            <View className="gap-3 pt-1">
              {[0, 1, 2].map((key) => (
                <CardSkeleton key={key} height={150} margin={0} />
              ))}
            </View>
          ) : (
            <GroupsEmptyState
              message={empty}
              onExplore={() => {
                if (activeTab === "discover") {
                  void query.refetch();
                  return;
                }
                setActiveTab("discover");
              }}
            />
          )
        }
      />
    </View>
  );
}

function CreateGroupCta() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  const open = () => {
    if (!requireAuth()) return;
    router.push("/groups/create" as never);
  };

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel="إنشاء مجموعة جديدة"
      className="mb-1 flex-row-reverse items-center gap-3 rounded-xl border border-dashed border-primary-400/40 p-3"
    >
      <View className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
        <Plus size={18} color={primaryColor} strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
          إنشاء فريق تطوعي جديد
        </Text>
        <Text size="2xs" className="mt-0.5 text-gray-500 dark:text-gray-300">
          تُراجعها الإدارة قبل النشر
        </Text>
      </View>
    </Pressable>
  );
}

function GroupsTabBar({
  activeTab,
  onChange,
}: {
  activeTab: GroupsTab;
  onChange: (tab: GroupsTab) => void;
}) {
  return (
    <View className="border-b border-gray-100 dark:border-dark-400">
      {/* Horizontal scroll keeps the row usable if labels grow or the device is narrow.
          `flexGrow: 1` makes the content box fill the viewport so that, in row-reverse,
          the pills stay pinned to the right edge instead of collapsing to the left. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "row-reverse",
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              className={`rounded-full px-4 py-2 ${isActive ? "bg-primary-400/15" : "bg-transparent"}`}
            >
              <Text
                size="xs"
                weight={isActive ? "semibold" : "medium"}
                className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function GroupsEmptyState({
  message,
  onExplore,
}: {
  message: string;
  onExplore: () => void;
}) {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
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
        <Button
          fullWidth
          size="small"
          onPress={() => {
            if (!requireAuth()) return;
            router.push("/groups/create" as never);
          }}
        >
          إنشاء فريق تطوعي
        </Button>
        <Button fullWidth size="small" variant="tertiary" onPress={onExplore}>
          تصفح الفرق التطوعية
        </Button>
      </View>
    </View>
  );
}
