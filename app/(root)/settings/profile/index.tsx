import SettingsCard from "@/components/pages/settings/settings-card";
import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { NavigationHelper } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "يرجى إدخال الاسم الأول"),
  lastName: z.string().min(2, "يرجى إدخال اسم العائلة"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صالح"),
  phoneNumber: z.string().min(8, "يرجى إدخال رقم هاتف صالح"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const {
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "مستخدم",
      lastName: "عطاء",
      email: "user@ataa.app",
      phoneNumber: "+9639******",
    },
  });

  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");
  const watchedEmail = watch("email");
  const watchedPhone = watch("phoneNumber");

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("تم الحفظ", "تم حفظ التغييرات بنجاح.");
  };

  const handleChangePhoto = () => {
    Alert.alert("قريبًا", "ميزة تغيير الصورة ستتوفر قريبًا.");
  };

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="الملف الشخصي" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleChangePhoto} className="relative">
            <View
              className={`size-28 rounded-full ${isDark ? "bg-dark-500" : "bg-gray-200"} items-center justify-center`}
            >
              <icons.user size={60} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} mt-2`}
            rtlAlign="left"
          >
            {watchedFirstName || "------"}
          </Text>
        </View>

        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              size="base"
              weight="bold"
              className={`${isDark ? "text-light-50" : "text-gray-800"}`}
              rtlAlign="left"
            >
              المعلومات الشخصية
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              disabled={isEditing}
            >
              <Text size="2xs" color="accent">
                {isEditing ? "إلغاء" : "تعديل"}
              </Text>
            </TouchableOpacity>
          </View>

          <Card className="gap-2" elevated={Platform.OS === "android"}>
            <View className="gap-2">
              <Text
                size="xs"
                weight="bold"
                className={`${isDark ? "text-light-50" : "text-gray-500"}`}
                rtlAlign="left"
              >
                الاسم الأول
              </Text>
              {isEditing ? (
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="أدخل اسمك الأول"
                      error={errors.firstName?.message}
                      fullWidth
                    />
                  )}
                />
              ) : (
                <Text
                  size="xs"
                  className={`${isDark ? "text-gray-400" : "text-gray-800"}`}
                  rtlAlign="left"
                >
                  {watchedFirstName || "-"}
                </Text>
              )}
            </View>

            <View className="gap-2">
              <Text
                size="xs"
                weight="bold"
                className={`${isDark ? "text-light-50" : "text-gray-500"}`}
                rtlAlign="left"
              >
                اسم العائلة
              </Text>
              {isEditing ? (
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="أدخل اسم العائلة"
                      error={errors.lastName?.message}
                      fullWidth
                    />
                  )}
                />
              ) : (
                <Text
                  size="xs"
                  className={`${isDark ? "text-gray-400" : "text-gray-800"}`}
                  rtlAlign="left"
                >
                  {watchedLastName || "-"}
                </Text>
              )}
            </View>

            <View className="gap-2">
              <Text
                size="xs"
                weight="bold"
                className={`${isDark ? "text-light-50" : "text-gray-500"}`}
                rtlAlign="left"
              >
                البريد الإلكتروني
              </Text>
              {isEditing ? (
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="+9639******"
                      keyboardType="phone-pad"
                      error={errors.phoneNumber?.message}
                      fullWidth
                    />
                  )}
                />
              ) : (
                <Text
                  size="xs"
                  className={`${isDark ? "text-gray-400" : "text-gray-800"}`}
                  rtlAlign="left"
                >
                  {watchedPhone || "-"}
                </Text>
              )}
            </View>

            <View className="gap-2">
              <Text
                size="xs"
                weight="bold"
                className={`${isDark ? "text-light-50" : "text-gray-500"}`}
                rtlAlign="left"
              >
                رقم الهاتف
              </Text>
              <Text
                size="xs"
                className={`${isDark ? "text-gray-400" : "text-gray-800"}`}
                rtlAlign="left"
              >
                {watchedEmail || "-"}
              </Text>
            </View>
          </Card>
          <SettingsCard
            title="تغيير كلمة المرور"
            description="إدارة كلمة المرور الخاصة بك"
            icon={<icons.lock size={20} color="#F59E0B" />}
            color="#F59E0B"
            onPress={() => NavigationHelper.goToChangePassword(router)}
          />
        </View>

        {isEditing && (
          <View className="px-4">
            <Button variant="primary" onPress={handleSave} disabled={!isDirty}>
              حفظ التغييرات
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Profile;
