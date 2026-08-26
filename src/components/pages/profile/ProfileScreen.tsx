import { useMemo, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import { toProfileSummary } from "@/src/features/account/helpers";
import { useAuthStatus } from "@/src/features/auth/queries";
import { ApiClientError } from "@/src/lib/api-client";
import {
  useArchivePost,
  useDeletePost,
  useMyPosts,
  useRepostPost,
} from "@/src/features/posts/queries";
import type { MyPostStatus } from "@/src/features/posts/types";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { MyPostCard } from "./MyPostCard";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { useToast } from "@/src/providers/ToastProvider";

const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

const STATUS_TABS: { key: MyPostStatus; label: string }[] = [
  { key: "draft", label: "مسودة" },
  { key: "pending", label: "قيد المراجعة" },
  { key: "active", label: "منشور" },
  { key: "rejected", label: "مرفوض" },
  { key: "archived", label: "مؤرشف" },
];

export function ProfileScreen() {
  const router = useRouter();
  const { onScroll } = useCollapsibleHeaderScreen();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<MyPostStatus>("active");

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const { data, isLoading, isError, refetch } = useMyPosts({
    enabled: isAuthenticated,
  });
  const archiveMutation = useArchivePost();
  const repostMutation = useRepostPost();
  const deleteMutation = useDeletePost();

  const posts = useMemo(() => data?.items ?? [], [data]);
  const filteredPosts = useMemo(
    () => posts.filter((post) => post.status === activeTab),
    [posts, activeTab],
  );
  const getTabCount = (status: MyPostStatus) =>
    posts.filter((post) => post.status === status).length;

  const summary = useMemo(() => {
    if (!user) return null;
    return toProfileSummary(user);
  }, [user]);

  const handleArchive = async (postId: string) => {
    try {
      await archiveMutation.mutateAsync(postId);
      toast.success("تم نقل المنشور إلى تبويب المنشورات المؤرشفة.", "تمت الأرشفة");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      toast.error(message, "تعذر أرشفة المنشور");
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      await repostMutation.mutateAsync(postId);
      toast.success("تم إرسال المنشور للمراجعة مجدداً.", "تمت إعادة الإرسال");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      toast.error(message, "تعذر إعادة نشر المنشور");
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteMutation.mutateAsync(postId);
      toast.success("تم حذف المنشور من منشوراتك.", "تم الحذف");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      toast.error(message, "تعذر حذف المنشور");
    }
  };

  if (isAuthLoading) {
    return (
      <View className="flex-1 gap-3 bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <CardSkeleton height={180} margin={0} />
        <CardSkeleton height={54} margin={0} />
        <CardSkeleton height={220} margin={0} />
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
        className="flex-1 px-4 dark:bg-dark-300"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MyPostCard
            post={item}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onRepost={handleRepost}
          />
        )}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View>
            <ProfileHeaderCard summary={summary} />
            <SectionHeader title="منشوراتي" />
            <View className="mb-3 flex-row-reverse flex-wrap gap-2">
              {STATUS_TABS.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    className={`rounded-xl px-3 py-2 ${
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
          isLoading ? (
            <View className="gap-3 py-3">
              <CardSkeleton height={220} margin={0} />
              <CardSkeleton height={220} margin={0} />
            </View>
          ) : isError ? (
            <View className="items-center gap-3 py-8">
              <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">
                تعذر تحميل منشوراتك. تحقق من اتصالك وحاول مرة أخرى.
              </Text>
              <Button size="small" onPress={() => void refetch()}>
                إعادة المحاولة
              </Button>
            </View>
          ) : (
            <View className="items-center py-8">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                لا توجد منشورات لعرضها حالياً.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
