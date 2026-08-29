import { useMemo } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, RefreshControl, View } from "react-native";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { HomePostCardSkeleton } from "@/src/components/pages/home/HomePostCardSkeleton";
import { OrganizationCampaignCard } from "@/src/components/pages/profile/OrganizationCampaignCard";
import { OrganizationVideoCard } from "@/src/components/pages/profile/OrganizationVideoCard";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useFollowingFeed } from "@/src/features/follows/queries";
import type { FollowingFeedItem } from "@/src/features/follows/types";
import { getPrimaryColor } from "@/src/theme";

/** Each wrapper maps onto a card the app already renders elsewhere. */
function FeedItemCard({ item, onOpenVideo }: { item: FollowingFeedItem; onOpenVideo: (id: string) => void }) {
  if (item.contentType === "post") {
    return <HomePostCard post={item.content} enableAuthorNavigation />;
  }
  if (item.contentType === "campaign") {
    return <OrganizationCampaignCard campaign={item.content} />;
  }
  return (
    <OrganizationVideoCard
      video={item.content}
      active={false}
      onPlay={() => onOpenVideo(item.content.id)}
    />
  );
}

export function FollowingFeedScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const { isAuthenticated } = useAuthStatus();
  const query = useFollowingFeed(isAuthenticated);
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-light-100 px-6 dark:bg-dark-300">
        <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
          سجّل الدخول لمتابعة الحسابات ومشاهدة محتواها هنا.
        </Text>
        <Button size="small" onPress={() => router.push("/(auth)/login")}>
          تسجيل الدخول
        </Button>
      </View>
    );
  }

  if (query.isLoading && items.length === 0) {
    return (
      <View className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <HomePostCardSkeleton />
        <HomePostCardSkeleton />
      </View>
    );
  }

  if (query.isError && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-light-100 px-6 dark:bg-dark-300">
        <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
          تعذر تحميل محتوى المتابَعين. تحقق من اتصالك وحاول مرة أخرى.
        </Text>
        <Button size="small" onPress={() => void query.refetch()}>
          إعادة المحاولة
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <FlatList
        className="flex-1 px-4"
        data={items}
        keyExtractor={(item) => `${item.contentType}-${item.content.id}`}
        renderItem={({ item }) => (
          <FeedItemCard
            item={item}
            onOpenVideo={(id) => router.push({ pathname: "/(tabs)/reels", params: { videoId: id } })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching && !query.isFetchingNextPage}
            onRefresh={() => void query.refetch()}
            tintColor={primaryColor}
          />
        }
        ListEmptyComponent={
          <View className="items-center gap-3 py-10">
            <Text size="sm" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
              تابع أشخاصًا ومنظمات لتشاهد محتواهم هنا.
            </Text>
            <Button size="small" variant="outline" onPress={() => router.push("/search")}>
              اكتشف الحسابات
            </Button>
          </View>
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <View className="py-2">
              <HomePostCardSkeleton />
            </View>
          ) : null
        }
      />
    </View>
  );
}
