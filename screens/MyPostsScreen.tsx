import { Header } from "@/components/sections";
import Text from "@/components/ui/Text";
import { NavigationHelper } from "@/lib/helpers";
import { AuthRequiredState, PostCard } from "@/src/components";
import { useAppData } from "@/src/context";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import type { PostStatus } from "@/src/types/posts";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const statusActions: PostStatus[] = ["published", "in_progress", "completed", "removed"];

const MyPostsScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isLoading, isAuthenticated } = useAuthStatus();
  const { posts, currentPublisherId, updatePostStatus } = useAppData();

  const myPosts = posts.filter((post) => post.ownerId === currentPublisherId);

  if (isLoading) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="منشوراتي" showBackButton={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#405d72" />
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="منشوراتي" showBackButton={true} />
        <AuthRequiredState
          message="يجب تسجيل الدخول لعرض منشوراتك."
          onPressSignIn={() => NavigationHelper.goToSignIn(router)}
        />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="منشوراتي" showBackButton={true} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 24,
        }}
      >
        <View className="px-4 mb-3">
          <Text
            size="sm"
            weight="semibold"
            className={`${isDark ? "text-light-50" : "text-gray-700"}`}
            rtlAlign="left"
          >
            {`إجمالي منشوراتي: ${myPosts.length}`}
          </Text>
        </View>

        {myPosts.length === 0 ? (
          <View className="px-4 py-4">
            <Text
              size="sm"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
              rtlAlign="left"
            >
              لا يوجد منشورات حتى الآن. ابدأ بإنشاء منشور جديد.
            </Text>
          </View>
        ) : null}

        {myPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            statusActions={statusActions}
            onPressStatusAction={(status) => updatePostStatus(post.id, status)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MyPostsScreen;
