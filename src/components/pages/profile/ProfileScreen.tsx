import { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import Text from "@/src/components/ui/Text";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { HomePostCardSkeleton } from "@/src/components/pages/home/HomePostCardSkeleton";
import { HomePostTypeEnum } from "@/src/constants/global";
import { mockProfilePayload } from "@/src/data/mockProfile";
import type { HomePost } from "@/src/types/home";
import type { CreatePostType } from "@/src/types/menu";
import { ProfilePostStatus, type ProfilePost } from "@/src/types/profile";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";

const PAGE_SIZE = 6;

const profilePostTabs: { key: ProfilePostStatus; label: string }[] = [
  { key: "posted", label: "منشور" },
  { key: "unposted", label: "مرفوض" },
  { key: "archived", label: "مؤرشف" },
];

const mapPostTypeToCreateType = (postType: HomePost["postType"]): CreatePostType => {
  if (postType === HomePostTypeEnum.DonationCampaign) return "donation";
  if (postType === HomePostTypeEnum.HelpRequest) return "help";
  return "volunteer";
};

export function ProfileScreen() {
  const router = useRouter();
  const { contentAnimatedStyle, onScroll } = useCollapsibleHeaderScreen();
  const [activeTab, setActiveTab] = useState<ProfilePostStatus>("posted");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posts, setPosts] = useState<ProfilePost[]>(mockProfilePayload.posts);

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.profileStatus === activeTab),
    [activeTab, posts],
  );
  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );
  const hasMore = visibleCount < filteredPosts.length;

  const getTabCount = (status: ProfilePostStatus) =>
    posts.filter((post) => post.profileStatus === status).length;

  const handleTabChange = (status: ProfilePostStatus) => {
    setActiveTab(status);
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
      setLoadingMore(false);
    }, 500);
  };

  const handleArchivePost = (post: HomePost) => {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id ? { ...item, profileStatus: "archived" } : item,
      ),
    );
    Alert.alert("تمت الأرشفة", "تم نقل المنشور إلى تبويب المنشورات المؤرشفة.");
  };

  const handleDeletePost = (post: HomePost) => {
    setPosts((prev) => prev.filter((item) => item.id !== post.id));
    Alert.alert("تم الحذف", "تم حذف المنشور من منشوراتك.");
  };

  const handleEditRejectedPost = (post: HomePost) => {
    router.push({
      pathname: "/(tabs)/create-post",
      params: {
        mode: "edit",
        postId: post.id,
        postType: mapPostTypeToCreateType(post.postType),
        title: post.title || "",
        details: post.content,
        city: post.publisher.city || "",
        images: post.images.join("|"),
      },
    });
  };

  return (
    <Animated.View className="flex-1 bg-light-100 dark:bg-dark-300" style={contentAnimatedStyle}>
      <Animated.FlatList
        className="flex-1 px-4 dark:bg-dark-300"
        contentContainerStyle={{ paddingBottom: 24 }}
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HomePostCard
            post={item}
            showCta={false}
            mode="own"
            ownPostStatus={item.profileStatus}
            onArchive={handleArchivePost}
            onDelete={handleDeletePost}
            onEdit={handleEditRejectedPost}
          />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        onScroll={onScroll}
        scrollEventThrottle={16}
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
                    onPress={() => handleTabChange(tab.key)}
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
        ListFooterComponent={
          loadingMore ? (
            <View className="py-2">
              <HomePostCardSkeleton />
            </View>
          ) : hasMore ? (
            <View className="py-2" />
          ) : (
            <View className="items-center py-4">
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                تم عرض جميع المنشورات
              </Text>
            </View>
          )
        }
      />
    </Animated.View>
  );
}
