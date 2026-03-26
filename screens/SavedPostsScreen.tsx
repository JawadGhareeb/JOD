import { Header } from "@/components/sections";
import Text from "@/components/ui/Text";
import { NavigationHelper } from "@/lib/helpers";
import { AuthRequiredState, PostCard } from "@/src/components";
import { useAppData } from "@/src/context";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const SavedPostsScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isLoading, isAuthenticated } = useAuthStatus();
  const { posts, savedPostIds, toggleSavePost } = useAppData();

  const savedPosts = posts.filter((post) => savedPostIds.includes(post.id));

  if (isLoading) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="المنشورات المحفوظة" showBackButton={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#405d72" />
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="المنشورات المحفوظة" showBackButton={true} />
        <AuthRequiredState
          message="يجب تسجيل الدخول لعرض المنشورات المحفوظة."
          onPressSignIn={() => NavigationHelper.goToSignIn(router)}
        />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="المنشورات المحفوظة" showBackButton={true} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 24,
        }}
      >
        {savedPosts.length === 0 ? (
          <View className="px-4 py-4">
            <Text
              size="sm"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
              rtlAlign="left"
            >
              لا توجد منشورات محفوظة حالياً.
            </Text>
          </View>
        ) : null}

        {savedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isSaved
            onToggleSave={() => toggleSavePost(post.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SavedPostsScreen;
