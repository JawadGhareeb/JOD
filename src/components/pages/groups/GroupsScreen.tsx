import { useState } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import Text from "@/src/components/ui/Text";
import {
  mockDiscoverGroups,
  mockMyGroups,
  mockSuggestedGroups,
} from "@/src/features/groups/mock-data";
import type { Group } from "@/src/features/groups/types";
import { getPrimaryColor } from "@/src/theme";
import { GroupCard } from "./GroupCard";

const GroupsIcon = appIcons.groups;

type GroupsTab = "forYou" | "myGroups" | "discover";

const TABS: { key: GroupsTab; label: string }[] = [
  { key: "forYou", label: "لك" },
  { key: "myGroups", label: "مجموعاتي" },
  { key: "discover", label: "اكتشف" },
];

type TabContent = { intro: string; groups: Group[]; showJoin: boolean; emptyMessage: string };

// TODO: replace the mock sources with the groups API once the endpoints exist.
const TAB_CONTENT: Record<GroupsTab, TabContent> = {
  forYou: {
    intro: "مجموعات مقترحة لك",
    groups: mockSuggestedGroups,
    showJoin: true,
    emptyMessage: "لا توجد اقتراحات حالياً.",
  },
  myGroups: {
    intro: "المجموعات التي انضممت إليها",
    groups: mockMyGroups,
    showJoin: false,
    emptyMessage: "لم تنضم إلى أي مجموعة بعد.",
  },
  discover: {
    intro: "تصفّح المجموعات",
    groups: mockDiscoverGroups,
    showJoin: true,
    emptyMessage: "لا توجد مجموعات لعرضها.",
  },
};

export function GroupsScreen() {
  const [activeTab, setActiveTab] = useState<GroupsTab>("forYou");
  const { intro, groups, showJoin, emptyMessage } = TAB_CONTENT[activeTab];

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
        ListHeaderComponent={
          groups.length > 0 ? (
            <Text size="2xs" className="mb-2 text-gray-500 dark:text-gray-300">
              {intro}
            </Text>
          ) : null
        }
        ListEmptyComponent={<GroupsEmptyState message={emptyMessage} />}
      />
    </View>
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

function GroupsEmptyState({ message }: { message: string }) {
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  return (
    <View className="items-center gap-3 py-16">
      <View className="size-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-dark-350">
        <GroupsIcon size={28} color={primaryColor} strokeWidth={2} />
      </View>
      <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
        {message}
      </Text>
    </View>
  );
}
