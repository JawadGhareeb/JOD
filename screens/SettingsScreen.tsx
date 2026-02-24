import { SettingsCard } from "@/components/pages/settings";
import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { NavigationHelper } from "@/lib/helpers";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, ScrollView, View } from "react-native";

const SettingsScreen = () => {
  const router = useRouter();

  const handleProfilePress = () => {
    NavigationHelper.goToProfile(router);
  };

  const handleNotificationsPress = () => {
    NavigationHelper.goToNotifications(router);
  };

  const handlePrivacyPolicyPress = () => {
    NavigationHelper.goToPrivacy(router);
  };

  const handleSupportPress = () => {
    NavigationHelper.goToSupport(router);
  };

  const handleAboutPress = () => {
    NavigationHelper.goToAbout(router);
  };

  const handleLogoutPress = () => {
    console.log("Logout pressed");
  };

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="الإعدادات" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 100,
        }}
      >
        <View>
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-2`}
            rtlAlign="left"
          >
            الحساب
          </Text>
          <SettingsCard
            title="الملف الشخصي"
            description="إدارة معلوماتك الشخصية والصورة"
            icon={<icons.user size={24} color="#3B82F6" />}
            color="#3B82F6"
            onPress={handleProfilePress}
          />
        </View>

        <View>
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-2`}
            rtlAlign="left"
          >
            التفضيلات
          </Text>
          <SettingsCard
            title="الإشعارات"
            description="إدارة إعدادات الإشعارات والتنبيهات"
            icon={<icons.bell size={24} color="#F59E0B" />}
            color="#F59E0B"
            onPress={handleNotificationsPress}
          />
        </View>

        <View>
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-2`}
            rtlAlign="left"
          >
            المساعدة والدعم
          </Text>

          <SettingsCard
            title="الدعم الفني"
            description="تواصل مع فريق الدعم لحل المشاكل"
            icon={<icons.helpCircle size={24} color="#06B6D4" />}
            color="#06B6D4"
            onPress={handleSupportPress}
          />
        </View>

        <View>
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-2`}
            rtlAlign="left"
          >
            معلومات قانونية
          </Text>
          <SettingsCard
            title="سياسة الخصوصية"
            description="تعرف على كيفية حماية بياناتك"
            icon={<icons.shield size={24} color="#6366F1" />}
            color="#6366F1"
            onPress={handlePrivacyPolicyPress}
          />
          <SettingsCard
            title="حول التطبيق"
            description="معلومات عن التطبيق والإصدار"
            icon={<icons.info size={24} color="#6B7280" />}
            color="#6B7280"
            onPress={handleAboutPress}
          />
        </View>

        <View>
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-2`}
            rtlAlign="left"
          >
            الحساب
          </Text>
          <Card
            onPress={handleLogoutPress}
            className="mb-4 mx-4"
            padding="md"
            radius="xl"
            elevated={Platform.OS === "android"}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-center gap-2">
              <icons.logOut size={18} color="#EF4444" />
              <Text size="2xs" weight="semibold" color="error">
                تسجيل الخروج
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
