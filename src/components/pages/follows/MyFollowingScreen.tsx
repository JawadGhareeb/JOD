import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import { FollowButton } from "@/src/components/shared/FollowButton";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { useMyFollowing } from "@/src/features/follows/queries";
import type { FollowTargetType, FollowedPublisher, FollowingFilter } from "@/src/features/follows/types";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";

const FILTERS: { value: FollowingFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "user", label: "الأشخاص" },
  { value: "organization", label: "المنظمات" },
];

const EMPTY_MESSAGES: Record<FollowingFilter, string> = {
  all: "أنت لا تتابع أي حساب بعد.",
  user: "لا تتابع أي مستخدم بعد.",
  organization: "لا تتابع أي منظمة بعد.",
};

export function MyFollowingScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FollowingFilter>("all");
  const query = useMyFollowing(filter);
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="المتابَعون" />

      <View className="mb-3 flex-row-reverse gap-2">
        {FILTERS.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setFilter(item.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === item.value }}
            className={`flex-1 rounded-xl border px-3 py-2.5 ${
              filter === item.value
                ? "border-primary-400 bg-primary-400/10"
                : "border-gray-200 dark:border-dark-400"
            }`}
          >
            <Text
              size="xs"
              weight="medium"
              rtlAlign="center"
              className={filter === item.value ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => `${item.publisherType}-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void query.refetch()}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => <FollowingRow item={item} onOpen={() => router.push({ pathname: "/author/[id]", params: { id: item.id } })} />}
        ListEmptyComponent={
          query.isLoading ? (
            <View className="gap-3">
              {[0, 1, 2].map((key) => (
                <CardSkeleton key={key} height={84} margin={0} />
              ))}
            </View>
          ) : (
            <View className="items-center gap-3 py-10">
              <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
                {EMPTY_MESSAGES[filter]}
              </Text>
              <Pressable onPress={() => router.push("/search")} accessibilityRole="button">
                <Text size="xs" weight="semibold" className="text-primary-400">
                  اكتشف الحسابات
                </Text>
              </Pressable>
            </View>
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? <CardSkeleton height={84} margin={0} /> : null
        }
      />
    </View>
  );
}

function FollowingRow({ item, onOpen }: { item: FollowedPublisher; onOpen: () => void }) {
  const targetType: FollowTargetType = item.publisherType === "organization" ? "organization" : "user";

  return (
    <Card
      padding="md"
      className="mb-3 border-gray-200 dark:border-dark-400"
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`فتح ملف ${item.name}`}
    >
      <View className="flex-row-reverse items-center gap-3">
        <Avatar name={item.name} imageUrl={item.avatarUrl} size={44} />
        <View className="flex-1">
          <View className="flex-row-reverse items-center gap-1">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {item.name}
            </Text>
            {targetType === "organization" && item.verified ? <VerifiedBadge /> : null}
          </View>
          <Text size="2xs" className="mt-0.5 text-gray-500 dark:text-gray-300">
            {targetType === "organization" ? "منظمة" : "مستخدم"} • {item.followersCount ?? 0} متابع
          </Text>
          {item.bio ? (
            <Text size="2xs" numberOfLines={1} className="mt-1 text-gray-500 dark:text-gray-300">
              {item.bio}
            </Text>
          ) : null}
        </View>
        <FollowButton
          targetType={targetType}
          targetId={item.id}
          isFollowing={item.isFollowing ?? true}
        />
      </View>
    </Card>
  );
}
