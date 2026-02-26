import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { NavigationHelper } from "@/lib/helpers";
import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { getAuthToken } from "@/utils/auth";

const savedPosts = [
  {
    id: "1",
    title: "وظيفة مطور تطبيقات",
    description: "تم حفظ هذا المنشور للمتابعة لاحقًا.",
  },
  {
    id: "2",
    title: "حملة تنظيف الأحياء",
    description: "منشور محفوظ للمشاركة في وقت لاحق.",
  },
];

const SavedPostsScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    const token = await getAuthToken();
    setIsAuthenticated(!!token);
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth]),
  );

  if (isAuthenticated === null) {
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
        <View className="px-4 py-6">
          <Card>
            <View className="gap-3">
              <Text size="sm" weight="semibold" rtlAlign="left">
                تسجيل الدخول مطلوب
              </Text>
              <Button onPress={() => NavigationHelper.goToSignIn(router)}>
                تسجيل الدخول
              </Button>
            </View>
          </Card>
        </View>
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
          paddingBottom: 40,
        }}
      >
        {savedPosts.map((post) => (
          <Card key={post.id} className="mx-4 mb-3">
            <Text size="sm" weight="semibold" rtlAlign="left">
              {post.title}
            </Text>
            <Text
              size="xs"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
              rtlAlign="left"
            >
              {post.description}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

export default SavedPostsScreen;
