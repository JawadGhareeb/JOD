import { SettingsCard } from "@/components/pages/settings";
import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { NavigationHelper } from "@/lib/helpers";
import { AuthRequiredState } from "@/src/components";
import { useAppData } from "@/src/context";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const PostsScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isLoading, isAuthenticated } = useAuthStatus();
  const { posts, savedPostIds, currentPublisherId } = useAppData();

  const myPostsCount = posts.filter(
    (post) => post.ownerId === currentPublisherId,
  ).length;

  if (isLoading) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="المنشورات" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#405d72" />
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="المنشورات" />
        <AuthRequiredState
          message="للوصول إلى إدارة المنشورات، يرجى تسجيل الدخول أولاً."
          onPressSignIn={() => NavigationHelper.goToSignIn(router)}
        />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="المنشورات" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 28,
        }}
      >
        <Text
          size="base"
          weight="bold"
          className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-2`}
          rtlAlign="left"
        >
          إدارة المنشورات
        </Text>

        <Card className="mx-4 mb-4" bordered={false} background={isDark ? "bg-dark-500" : "bg-primary-300"}>
          <View className="gap-1">
            <Text size="xs" weight="semibold" color="accent" rtlAlign="left">
              ملخص سريع
            </Text>
            <Text size="xs" color="accent" rtlAlign="left">
              {`منشوراتي: ${myPostsCount}`}
            </Text>
            <Text size="xs" color="accent" rtlAlign="left">
              {`المحفوظة: ${savedPostIds.length}`}
            </Text>
          </View>
        </Card>

        <SettingsCard
          title="إنشاء منشور"
          description="نشر عرض أو طلب جديد"
          icon={<icons.plus size={24} color="#3B82F6" />}
          color="#3B82F6"
          onPress={() => NavigationHelper.goToCreatePost(router)}
        />

        <SettingsCard
          title="منشوراتي"
          description="إدارة الحالة والتعديل وإعادة الإرسال"
          icon={<icons.bookOpen size={24} color="#10B981" />}
          color="#10B981"
          onPress={() => NavigationHelper.goToMyPosts(router)}
        />

        <SettingsCard
          title="المنشورات المحفوظة"
          description="عرض المنشورات التي قمت بحفظها"
          icon={<icons.heart size={24} color="#EC4899" />}
          color="#EC4899"
          onPress={() => NavigationHelper.goToSavedPosts(router)}
        />
      </ScrollView>
    </View>
  );
};

export default PostsScreen;
