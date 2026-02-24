import {
  DonationCard,
  OpportunityCard,
  StatisticsCard,
} from "@/components/pages";
import { Header } from "@/components/sections";
import { Button, Container } from "@/components/ui";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { NavigationHelper } from "@/lib/helpers";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const statistics = [
    {
      title: "إجمالي التبرعات",
      value: "1,234",
      icon: <icons.heart size={24} color="#EF4444" />,
      color: "#EF4444",
      onPress: () => NavigationHelper.goToDonations(router),
    },
    {
      title: "الحملات",
      value: "56",
      icon: <icons.trendingUp size={24} color="#3B82F6" />,
      color: "#3B82F6",
      onPress: () => NavigationHelper.goToDonations(router),
    },
    {
      title: "فرص العمل",
      value: "89",
      icon: <icons.briefcase size={24} color="#10B981" />,
      color: "#10B981",
      onPress: () => NavigationHelper.goToOpportunities(router),
    },
  ];

  const donations = [
    {
      title: "حملة دعم التعليم",
      description: "مساعدة الطلاب المحتاجين في الحصول على المستلزمات الدراسية",
      amount: "50,000 ر.س",
      progress: 75,
      type: "donation_campaign" as const,
    },
    {
      title: "حملة الغذاء",
      description: "توفير وجبات غذائية للأسر المحتاجة",
      amount: "30,000 ر.س",
      progress: 60,
      type: "donation_campaign" as const,
    },
    {
      title: "حملة تنظيف الشواطئ",
      description: "مبادرة تطوعية لتنظيف الشواطئ والحفاظ على البيئة",
      type: "volunteer_campaign" as const,
    },
    {
      title: "حملة زراعة الأشجار",
      description: "مبادرة تطوعية لزراعة الأشجار في الأحياء السكنية",
      type: "volunteer_campaign" as const,
    },
  ];

  const opportunities = [
    {
      title: "مطور تطبيقات",
      description: "مطلوب مطور تطبيقات جوال بخبرة 3 سنوات في React Native",
      location: "الرياض",
    },
    {
      title: "مصمم جرافيك",
      description: "مطلوب مصمم جرافيك محترف للعمل على مشاريع خيرية",
      location: "جدة",
    },
    {
      title: "مدير مشاريع",
      description: "مطلوب مدير مشاريع لإدارة الحملات الخيرية والتطوعية",
      location: "الرياض",
    },
  ];

  return (
    <Container>
      <Header pageTitle="الرئيسية" />
      <Container scrollable>
        <View className="gap-2">
          <Text
            size="base"
            weight="bold"
            className={`${isDark ? "text-light-50" : "text-gray-800"}`}
            rtlAlign="left"
          >
            احصائيات منصتنا
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{
              gap: 12,
            }}
          >
            {statistics.map((stat, index) => (
              <StatisticsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                onPress={stat.onPress}
              />
            ))}
          </ScrollView>
        </View>

        <View className="gap-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              size="base"
              weight="bold"
              className={`${isDark ? "text-light-50" : "text-gray-800"}`}
              rtlAlign="left"
            >
              التبرعات والحملات التطوعية
            </Text>
            <Button
              variant="secondary"
              size="small"
              onPress={() => NavigationHelper.goToDonations(router)}
            >
              عرض جميع التبرعات
            </Button>
          </View>
          {donations.map((donation, index) => (
            <DonationCard
              key={index}
              title={donation.title}
              description={donation.description}
              amount={donation.amount}
              progress={donation.progress}
              type={donation.type}
            />
          ))}
        </View>

        <View className="gap-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              size="base"
              weight="bold"
              className={`${isDark ? "text-light-50" : "text-gray-800"}`}
              rtlAlign="left"
            >
              فرص العمل
            </Text>
            <Button
              variant="secondary"
              size="small"
              onPress={() => NavigationHelper.goToOpportunities(router)}
            >
              عرض جميع الفرص
            </Button>
          </View>
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              title={opportunity.title}
              description={opportunity.description}
              location={opportunity.location}
            />
          ))}
        </View>
      </Container>
    </Container>
  );
};

export default HomeScreen;
