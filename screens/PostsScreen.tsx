import { SettingsCard } from "@/components/pages/settings";
import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { NavigationHelper } from "@/lib/helpers";
import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { getAuthToken } from "@/utils/auth";

const PostsScreen = () => {
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
        <View className="px-4 py-6">
          <Card>
            <View className="gap-3">
              <Text
                size="sm"
                weight="semibold"
                className={`${isDark ? "text-light-50" : "text-gray-800"}`}
                rtlAlign="left"
              >
                تسجيل الدخول مطلوب
              </Text>
              <Text
                size="xs"
                className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                rtlAlign="left"
              >
                للوصول إلى صفحة المنشورات، يرجى تسجيل الدخول أولًا.
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
      <Header pageTitle="المنشورات" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 80,
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

        <SettingsCard
          title="إنشاء منشور"
          description="إضافة منشور جديد"
          icon={<icons.plus size={24} color="#3B82F6" />}
          color="#3B82F6"
          onPress={() => NavigationHelper.goToCreatePost(router)}
        />

        <SettingsCard
          title="منشوراتي"
          description="عرض المنشورات التي قمت بنشرها"
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

