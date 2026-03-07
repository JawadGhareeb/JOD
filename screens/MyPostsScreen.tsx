import { Header } from "@/components/sections";
import Text from "@/components/ui/Text";
import { NavigationHelper } from "@/lib/helpers";
import { AuthRequiredState, PostCard } from "@/src/components";
import { useAppData } from "@/src/context";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { getNextPostStatuses } from "@/src/utils/postHelpers";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const MyPostsScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isLoading, isAuthenticated } = useAuthStatus();
  const { posts, currentPublisherId, updatePostStatus, toggleSavePost, savedPostIds } =
    useAppData();

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
          paddingBottom: 40,
        }}
      >
        <Text
          size="sm"
          className={`${isDark ? "text-gray-400" : "text-gray-500"} px-4 mb-2`}
          rtlAlign="left"
        >
          {`إجمالي منشوراتي: ${myPosts.length}`}
        </Text>

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
            isSaved={savedPostIds.includes(post.id)}
            statusActions={getNextPostStatuses(post.status)}
            onPressStatusAction={(nextStatus) => updatePostStatus(post.id, nextStatus)}
            onToggleSave={() => toggleSavePost(post.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MyPostsScreen;
