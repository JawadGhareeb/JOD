import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import { NavigationHelper } from "@/lib/helpers";
import { AuthRequiredState } from "@/src/components";
import { useAppData } from "@/src/context";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import type { CreatePostInput } from "@/src/types/posts";
import {
  CONTACT_METHOD_OPTIONS,
  parseTagsInput,
  PICKUP_METHOD_OPTIONS,
  POST_CATEGORIES,
  POST_TYPE_OPTIONS,
  type SelectOption,
} from "@/src/utils/postHelpers";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Pressable,
  ScrollView,
  View,
} from "react-native";

const CreatePostScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { createPost } = useAppData();
  const { isLoading, isAuthenticated } = useAuthStatus();

  const [form, setForm] = useState<CreatePostInput>({
    title: "",
    description: "",
    type: "offer",
    category: POST_CATEGORIES[0],
    tags: [],
    city: "",
    area: "",
    pickupMethod: "direct",
    contactMethod: "phone",
  });
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof CreatePostInput>(
    key: K,
    value: CreatePostInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (values: CreatePostInput): string | null => {
    if (!values.title.trim()) return "يرجى إدخال عنوان المنشور.";
    if (!values.description.trim()) return "يرجى إدخال وصف واضح للمنشور.";
    if (!values.city.trim()) return "يرجى تحديد المدينة.";
    return null;
  };

  const handleCreatePost = async () => {
    const payload: CreatePostInput = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      city: form.city.trim(),
      area: form.area?.trim() || undefined,
      tags: parseTagsInput(tagsInput),
    };

    const validationMessage = validate(payload);

    if (validationMessage) {
      Alert.alert("حقول مطلوبة", validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      createPost(payload);
      setTagsInput("");
      setForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        city: "",
        area: "",
        tags: [],
      }));
      Alert.alert("تم الإرسال", "تم إرسال المنشور للمراجعة بنجاح.");
      NavigationHelper.goToMyPosts(router);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOptions = <T extends string>(
    title: string,
    options: SelectOption<T>[],
    value: T,
    onSelect: (next: T) => void,
  ) => (
    <View className="gap-2">
      <Text
        size="xs"
        weight="semibold"
        className={`${isDark ? "text-light-50" : "text-gray-700"}`}
        rtlAlign="left"
      >
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <Pressable
              key={`${title}-${option.value}`}
              onPress={() => onSelect(option.value)}
              className={`px-3 py-2 rounded-full border ${isActive ? "border-primary-400 bg-primary-300" : isDark ? "border-dark-400 bg-dark-500" : "border-gray-200 bg-white"}`}
            >
              <Text
                size="2xs"
                weight={isActive ? "semibold" : "regular"}
                className={`${isActive ? "text-primary-400" : isDark ? "text-light-50" : "text-gray-600"}`}
                rtlAlign="center"
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  if (isLoading) {
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
        <AuthRequiredState
          message="يجب تسجيل الدخول قبل إنشاء منشور جديد."
          onPressSignIn={() => NavigationHelper.goToSignIn(router)}
        />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="إنشاء منشور" showBackButton={true} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 15, paddingBottom: 28 }}
      >
        <Card className="mx-4">
          <View className="gap-4">
            {renderOptions("نوع المنشور", POST_TYPE_OPTIONS, form.type, (next) =>
              updateField("type", next),
            )}

            <Input
              label="عنوان المنشور"
              value={form.title}
              onChangeText={(value) => updateField("title", value)}
              placeholder="اكتب عنواناً واضحاً"
              fullWidth
            />

            <Input
              label="وصف المنشور"
              value={form.description}
              onChangeText={(value) => updateField("description", value)}
              placeholder="اكتب تفاصيل المنشور"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              inputClassName="min-h-[120px] pt-3"
              fullWidth
            />

            <Input
              label="المدينة"
              value={form.city}
              onChangeText={(value) => updateField("city", value)}
              placeholder="مثال: دمشق"
              fullWidth
            />

            <Input
              label="المنطقة (اختياري)"
              value={form.area}
              onChangeText={(value) => updateField("area", value)}
              placeholder="مثال: المزة"
              fullWidth
            />

            <View className="gap-2">
              <Text
                size="xs"
                weight="semibold"
                className={`${isDark ? "text-light-50" : "text-gray-700"}`}
                rtlAlign="left"
              >
                التصنيفات
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                  gap: 8,
                  paddingVertical: 2,
                }}
              >
                {POST_CATEGORIES.map((category) => {
                  const isActive = form.category === category;

                  return (
                    <Pressable
                      key={category}
                      onPress={() => updateField("category", category)}
                      className={`px-3 py-2 rounded-full border ${isActive ? "border-primary-400 bg-primary-300" : isDark ? "border-dark-400 bg-dark-500" : "border-gray-200 bg-white"}`}
                    >
                      <Text
                        size="2xs"
                        weight={isActive ? "semibold" : "regular"}
                        className={`${isActive ? "text-primary-400" : isDark ? "text-light-50" : "text-gray-600"}`}
                        rtlAlign="center"
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <Input
              label="التاغات"
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="مثال: عاجل، للأطفال، مستعمل"
              fullWidth
            />

            {renderOptions("طريقة الاستلام", PICKUP_METHOD_OPTIONS, form.pickupMethod, (next) =>
              updateField("pickupMethod", next),
            )}

            {renderOptions("طريقة التواصل", CONTACT_METHOD_OPTIONS, form.contactMethod, (next) =>
              updateField("contactMethod", next),
            )}

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
