import { SupportCard, SupportOption } from "@/components/pages";
import { Header } from "@/components/sections";
import { Card } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { Linking, Platform, ScrollView, View } from "react-native";

const Support = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const supportOptions: SupportOption[] = [
    {
      id: "faq",
      title: "الأسئلة الشائعة",
      description: "ابحث عن إجابات للأسئلة الأكثر شيوعاً",
      icon: <icons.helpCircle size={24} color="#3B82F6" />,
      color: "#3B82F6",
      action: () => Linking.openURL("https://ataa.app/faq"),
    },
    {
      id: "email",
      title: "البريد الإلكتروني",
      description: "support@ataa.app",
      icon: <icons.mail size={24} color="#10B981" />,
      color: "#10B981",
      action: () => Linking.openURL("mailto:support@ataa.app"),
    },
    {
      id: "phone",
      title: "الهاتف",
      description: "+966 50 123 4567",
      icon: <icons.phone size={24} color="#F59E0B" />,
      color: "#F59E0B",
      action: () => Linking.openURL("tel:+966501234567"),
    },
    {
      id: "whatsapp",
      title: "واتساب",
      description: "تواصل معنا عبر واتساب",
      icon: <icons.messageCircle size={24} color="#25D366" />,
      color: "#25D366",
      action: () => Linking.openURL("https://wa.me/966501234567"),
    },
    {
      id: "telegram",
      title: "تيليجرام",
      description: "@AtaaSupport",
      icon: <icons.send size={24} color="#0088CC" />,
      color: "#0088CC",
      action: () => Linking.openURL("https://t.me/AtaaSupport"),
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="الدعم الفني" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <View className="px-4 mb-6">
          <Card
            background={isDark ? "bg-dark-500" : "bg-primary-300"}
            bordered={false}
            elevated={Platform.OS === "android"}
          >
            <View className="flex-row items-center mb-2 gap-2">
              <icons.clock size={20} color="#6949ff" />
              <Text size="xs" weight="semibold" color="accent" rtlAlign="left">
                وقت الاستجابة
              </Text>
            </View>
            <Text size="xs" color="accent" rtlAlign="left">
              نحن نرد على جميع الاستفسارات خلال 24 ساعة. للاستفسارات العاجلة،
              يرجى التواصل عبر الهاتف أو واتساب.
            </Text>
          </Card>
        </View>

        <View>
          <Text
            size="base"
            weight="bold"
            color="primary"
            className={`${isDark ? "text-light-50" : "text-gray-800"} px-4 mb-4`}
            rtlAlign="left"
          >
            طرق التواصل
          </Text>

          {supportOptions.map((option) => (
            <SupportCard key={option.id} option={option} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Support;
