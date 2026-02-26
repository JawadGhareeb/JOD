import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import { NavigationHelper } from "@/lib/helpers";
import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { getAuthToken } from "@/utils/auth";

const CreatePostScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = await getAuthToken();
    setIsAuthenticated(!!token);
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth]),
  );

  const handleCreatePost = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("حقول مطلوبة", "يرجى تعبئة عنوان المنشور ووصفه.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Placeholder until backend API is connected.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTitle("");
      setDescription("");
      Alert.alert("تم النشر", "تم إنشاء المنشور بنجاح.");
      NavigationHelper.goToMyPosts(router);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="إنشاء منشور" showBackButton={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#405d72" />
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
        <Header pageTitle="إنشاء منشور" showBackButton={true} />
        <View className="px-4 py-6">
          <Card>
            <View className="gap-3">
              <Text size="sm" weight="semibold" rtlAlign="right">
                تسجيل الدخول مطلوب
              </Text>
              <Text
                size="xs"
                className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                rtlAlign="right"
              >
                يجب تسجيل الدخول أولاً قبل إنشاء منشور جديد.
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
      <Header pageTitle="إنشاء منشور" showBackButton={true} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 15, paddingBottom: 40 }}
      >
        <Card className="mx-4">
          <View className="gap-4">
            <Input
              label="عنوان المنشور"
              value={title}
              onChangeText={setTitle}
              placeholder="اكتب عنواناً واضحاً"
              fullWidth
            />

            <Input
              label="وصف المنشور"
              value={description}
              onChangeText={setDescription}
              placeholder="اكتب تفاصيل المنشور"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              inputClassName="min-h-[120px] pt-3"
              fullWidth
            />

            <Button
              variant="primary"
              onPress={handleCreatePost}
              loading={isSubmitting}
              fullWidth
            >
              نشر المنشور
            </Button>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default CreatePostScreen;
