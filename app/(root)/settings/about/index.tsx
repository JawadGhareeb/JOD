import {
  AppInfo,
  ContactCard,
  ContactItem,
  FeaturesCard,
  InfoCard,
  LegalCard,
  SocialLink,
  SocialLinkCard,
  StatItem,
  StatsCard,
} from "@/components/pages";
import { Header } from "@/components/sections";
import Text from "@/components/ui/Text";
import { icons, Images } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { Image, Linking, ScrollView, View } from "react-native";

const About = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const appInfo: AppInfo = {
    name: "Quizzy",
    version: "1.0.0",
    build: "2024.12.15",
    developer: "Quizzy Team",
    website: "https://quizzy.com",
    email: "info@quizzy.com",
  };

  const features = [
    "اختبارات تفاعلية في جميع المواد",
    "نظام تقييم ذكي للطلاب",
    "إحصائيات مفصلة للتقدم",
    "مساعد ذكي لحل الأسئلة",
    "واجهة سهلة الاستخدام",
    "دعم متعدد اللغات",
  ];

  const socialLinks: SocialLink[] = [
    {
      name: "الموقع الرسمي",
      url: "https://quizzy.com",
      icon: <icons.globe size={20} color="#3B82F6" />,
      color: "#3B82F6",
    },
    {
      name: "فيسبوك",
      url: "https://facebook.com/quizzy",
      icon: <icons.facebook size={20} color="#1877F2" />,
      color: "#1877F2",
    },
    {
      name: "إنستغرام",
      url: "https://instagram.com/quizzy",
      icon: <icons.instagram size={20} color="#E4405F" />,
      color: "#E4405F",
    },
  ];

  const contactItems: ContactItem[] = [
    {
      icon: <icons.mail size={20} color="#6949ff" />,
      text: appInfo.email,
    },
    {
      icon: <icons.globe size={20} color="#6949ff" />,
      text: appInfo.website,
    },
    {
      icon: <icons.mapPin size={20} color="#6949ff" />,
      text: "حماه, سوريا",
    },
  ];

  const appStats: StatItem[] = [
    { value: "10K+", label: "مستخدم نشط" },
    { value: "50K+", label: "اختبار مكتمل" },
    { value: "4.8", label: "تقييم المستخدمين" },
  ];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };
  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="حول التطبيق" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <View className="items-center mb-4">
          <View className="w-24 h-24 rounded-2xl items-center justify-center overflow-hidden">
            <Image
              source={Images.logo}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <Text
            size="lg"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"}`}
            rtlAlign="center"
          >
            {appInfo.name}
          </Text>
          <Text size="2xs" className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-1`} rtlAlign="center">
            الإصدار {appInfo.version}
          </Text>
          <Text size="sm" className={`${isDark ? "text-gray-400" : "text-gray-500"}`} rtlAlign="center">
            البناء {appInfo.build}
          </Text>
        </View>

        <InfoCard
          title="عن التطبيق"
          content="Quizzy هو تطبيق تعليمي متطور يساعد الطلاب على تحسين أدائهم الأكاديمي من خلال اختبارات تفاعلية ونظام تقييم ذكي. نحن نؤمن بأن التعلم يجب أن يكون ممتعاً وفعالاً"
        />

        <FeaturesCard title="الميزات الرئيسية" features={features} />

        <View className="mb-4 gap-2">
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4`}
            rtlAlign="left"
          >
            تابعنا
          </Text>
          {socialLinks.map((link, index) => (
            <SocialLinkCard key={index} link={link} onPress={handleLinkPress} />
          ))}
        </View>

        <ContactCard title="معلومات التواصل" items={contactItems} />

        <LegalCard
          copyright="© 2024 Quizzy. جميع الحقوق محفوظة"
          description="هذا التطبيق محمي بموجب قوانين حقوق الطبع والنشر"
        />

        <StatsCard title="إحصائيات التطبيق" stats={appStats} />
      </ScrollView>
    </View>
  );
};

export default About;
