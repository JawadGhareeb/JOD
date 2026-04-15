import { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { mockProfilePayload } from "@/src/data/mockProfile";
import { ProfilePostStatus } from "@/src/types/profile";
import { ProfileHeaderCard } from "./ProfileHeaderCard";

const profilePostTabs: Array<{ key: ProfilePostStatus; label: string }> = [
  { key: "posted", label: "منشور" },
  { key: "unposted", label: "مرفوض" },
  { key: "archived", label: "مؤرشف" },
];

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfilePostStatus>("posted");

  const filteredPosts = useMemo(
    () => mockProfilePayload.posts.filter((post) => post.profileStatus === activeTab),
    [activeTab],
  );

  const getTabCount = (status: ProfilePostStatus) =>
    mockProfilePayload.posts.filter((post) => post.profileStatus === status).length;

  return (
    <FlatList
      className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300"
      contentContainerStyle={{ paddingBottom: 24 }}
      data={filteredPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HomePostCard post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <ProfileHeaderCard summary={mockProfilePayload.summary} />
          <SectionHeader title="منشوراتي" />
          <View className="mb-3 flex-row-reverse gap-2">
            {profilePostTabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-xl px-3 py-2 ${
                    isActive ? "bg-primary-400/15" : "bg-white dark:bg-dark-500"
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Text
                      size="xs"
                      weight="medium"
                      className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
                    >
                      {tab.label}
                    </Text>
                    <View
                      className={`size-6 items-center justify-center rounded-full ${
                        isActive ? "bg-primary-400" : "bg-gray-200 dark:bg-dark-350"
                      }`}
                    >
                      <Text
                        size="2xs"
                        weight="medium"
                        className={isActive ? "text-light-50" : "text-gray-600 dark:text-gray-200"}
                      >
                        {getTabCount(tab.key)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            لا توجد منشورات لعرضها حالياً.
          </Text>
        </View>
      }
      ListFooterComponent={<View className="py-2" />}
    />
  );
}
