import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import { toProfileSummary } from "@/src/features/account/helpers";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useMyFollowing } from "@/src/features/follows/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { useOnTabReselect } from "@/src/lib/tab-reselect";
import { useDeletePost, useMyPosts } from "@/src/features/posts/queries";
import type { MyPost, MyPostStatus } from "@/src/features/posts/types";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { MyPostCard } from "./MyPostCard";
import { MyPostCardSkeleton } from "./MyPostCardSkeleton";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { useToast } from "@/src/providers/ToastProvider";

const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

const STATUS_TABS: { key: MyPostStatus; label: string }[] = [
  { key: "published", label: "منشور" },
  { key: "pending", label: "مراجعة" },
  { key: "blocked", label: "مرفوض" },
  { key: "draft", label: "مسودة" },
];

export function ProfileScreen() {
  const router = useRouter();
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<MyPostStatus>("published");
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const listRef = useRef<Animated.FlatList<MyPost>>(null);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const followingQuery = useMyFollowing("all", isAuthenticated);
  const { data, isLoading, isError, refetch } = useMyPosts({
    enabled: isAuthenticated,
    params: { perPage: 100 },
  });
  const deleteMutation = useDeletePost();
  const posts = useMemo(() => data?.items ?? [], [data]);
  const filteredPosts = useMemo(() => posts.filter((post) => post.status === activeTab), [posts, activeTab]);
  const summary = useMemo(() => (user ? toProfileSummary(user) : null), [user]);
  const followingCount = followingQuery.data?.pages[0]?.meta.total ?? 0;
  const getTabCount = (status: MyPostStatus) => posts.filter((post) => post.status === status).length;
  // Only show skeleton on first load / empty tab while fetching — never the top refresh spinner for background refetches.
  const showListLoading = isLoading && posts.length === 0;

  const refreshPosts = useCallback(async () => {
    if (!isAuthenticated) return;
    await refetch();
  }, [isAuthenticated, refetch]);

  useFocusEffect(
    useCallback(() => {
      void refreshPosts();
    }, [refreshPosts]),
  );

  useOnTabReselect("profile", () => {
    resetHeader();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    void refreshPosts();
  });

  const selectTab = (status: MyPostStatus) => {
    setActiveTab(status);
    // Silent background refresh — keep current list visible, no top loading bar.
    void refreshPosts();
  };

  const handlePullRefresh = async () => {
    setIsPullRefreshing(true);
    try {
      await refreshPosts();
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteMutation.mutateAsync(postId);
      toast.success("تم حذف المنشور.", "تم الحذف");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE, "تعذر حذف المنشور");
    }
  };

  if (isAuthLoading) {
    return (
      <View className="flex-1 gap-3 bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <CardSkeleton height={220} margin={0} />
        <CardSkeleton height={54} margin={0} />
        <MyPostCardSkeleton />
      </View>
    );
  }

  if (!isAuthenticated || !summary) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-light-100 px-6 dark:bg-dark-300">
        <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
          سجّل الدخول لعرض ملفك الشخصي
        </Text>
        <Text size="xs" className="text-center text-gray-500 dark:text-gray-300">
          منشوراتك وإحصائياتك تظهر هنا بعد تسجيل الدخول.
        </Text>
        <Button size="small" onPress={() => router.push("/(auth)/login")}>
          تسجيل الدخول
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <Animated.FlatList
        ref={listRef}
        className="flex-1 dark:bg-dark-300"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MyPostCard
            post={item}
            authorName={summary.name}
            authorUsername={summary.username}
            onDelete={handleDelete}
          />
        )}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshing={isPullRefreshing}
        onRefresh={() => void handlePullRefresh()}
        ListHeaderComponent={
          <View>
            <View className="px-4">
              <ProfileHeaderCard summary={summary} followingCount={followingCount} />
              <SectionHeader title="منشوراتي" />
            </View>

            <View className="mb-1 border-y border-gray-100 dark:border-dark-400">
              <View className="flex-row-reverse">
                {STATUS_TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  const count = getTabCount(tab.key);
                  return (
                    <Pressable
                      key={tab.key}
                      onPress={() => selectTab(tab.key)}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: isActive }}
                      accessibilityLabel={`${tab.label} ${count}`}
                      className="relative flex-1 items-center py-3"
                    >
                      <View className="flex-row-reverse items-center gap-1">
                        <Text
                          size="xs"
                          weight={isActive ? "semibold" : "medium"}
                          className={
                            isActive
                              ? "text-primary-400"
                              : "text-gray-400 dark:text-gray-400"
                          }
                        >
                          {tab.label}
                        </Text>
                        <Text
                          size="xs"
                          weight={isActive ? "semibold" : "medium"}
                          className={
                            isActive
                              ? "text-primary-400"
                              : "text-gray-400 dark:text-gray-500"
                          }
                        >
                          {count}
                        </Text>
                      </View>
                      {isActive ? (
                        <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          showListLoading ? (
            <View className="py-3">
              <MyPostCardSkeleton />
              <MyPostCardSkeleton />
            </View>
          ) : isError ? (
            <View className="items-center gap-3 py-8">
              <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">
                تعذر تحميل منشوراتك. تحقق من اتصالك وحاول مرة أخرى.
              </Text>
              <Button size="small" onPress={() => void refreshPosts()}>
                إعادة المحاولة
              </Button>
            </View>
          ) : (
            <View className="items-center py-10 px-4">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                لا توجد منشورات ضمن هذا القسم.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
