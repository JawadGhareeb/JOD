import { DonationCard } from "@/components/pages";
import { Header } from "@/components/sections";
import { Card, Container, Modal, Tabs, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const DonationsScreen = () => {
  const [activeTab, setActiveTab] = useState<
    "donation_campaign" | "volunteer_campaign"
  >("donation_campaign");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const locations = [
    "الرياض",
    "جدة",
    "الدمام",
    "المدينة المنورة",
    "مكة المكرمة",
    "الطائف",
    "أبها",
    "جميع المناطق",
  ];

  const allDonations = [
    {
      title: "حملة دعم التعليم",
      description: "مساعدة الطلاب المحتاجين في الحصول على المستلزمات الدراسية",
      amount: "50,000 ر.س",
      progress: 75,
      type: "donation_campaign" as const,
      location: "الرياض",
    },
    {
      title: "حملة الغذاء",
      description: "توفير وجبات غذائية للأسر المحتاجة",
      amount: "30,000 ر.س",
      progress: 60,
      type: "donation_campaign" as const,
      location: "جدة",
    },
    {
      title: "حملة رمضان",
      description: "توفير وجبات إفطار للأسر المحتاجة خلال شهر رمضان",
      amount: "60,000 ر.س",
      progress: 90,
      type: "donation_campaign" as const,
      location: "المدينة المنورة",
    },
    {
      title: "حملة الشتاء",
      description: "توفير الملابس والدفايات للأسر المحتاجة في فصل الشتاء",
      amount: "40,000 ر.س",
      progress: 80,
      type: "donation_campaign" as const,
      location: "الدمام",
    },
    {
      title: "حملة الصحة",
      description: "توفير الرعاية الصحية للأسر المحتاجة",
      amount: "75,000 ر.س",
      progress: 45,
      type: "donation_campaign" as const,
      location: "مكة المكرمة",
    },
    {
      title: "حملة تنظيف الشواطئ",
      description: "مبادرة تطوعية لتنظيف الشواطئ والحفاظ على البيئة",
      type: "volunteer_campaign" as const,
      location: "جدة",
    },
    {
      title: "حملة زراعة الأشجار",
      description: "مبادرة تطوعية لزراعة الأشجار في الأحياء السكنية",
      type: "volunteer_campaign" as const,
      location: "الرياض",
    },
    {
      title: "حملة تنظيف الأحياء",
      description: "مبادرة تطوعية لتنظيف الأحياء والحدائق العامة",
      type: "volunteer_campaign" as const,
      location: "الطائف",
    },
    {
      title: "حملة التوعية الصحية",
      description: "مبادرة تطوعية لنشر التوعية الصحية في المجتمع",
      type: "volunteer_campaign" as const,
      location: "أبها",
    },
  ];

  const tabs = [
    { id: "donation_campaign", label: "التبرعات" },
    { id: "volunteer_campaign", label: "الحملات التطوعية" },
  ];

  const filteredDonations = allDonations.filter((donation) => {
    const matchesType = donation.type === activeTab;
    const matchesLocation =
      !selectedLocation ||
      selectedLocation === "جميع المناطق" ||
      donation.location === selectedLocation;
    return matchesType && matchesLocation;
  });

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location === "جميع المناطق" ? null : location);
    setIsLocationModalVisible(false);
  };

  const MapPinIcon = icons.mapPin;

  return (
    <Container>
      <Header pageTitle="التبرعات والحملات" showBackButton={false} />
      <Container scrollable>
        <View className="gap-4">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) =>
              setActiveTab(tabId as "donation_campaign" | "volunteer_campaign")
            }
          />
          <Card
            onPress={() => setIsLocationModalVisible(true)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2 flex-1">
              <MapPinIcon size={20} color="#405d72" />
              <Text size="sm" weight="medium" rtlAlign="right">
                {selectedLocation || "اختر الموقع"}
              </Text>
            </View>
            <Text size="xs" color="primary" rtlAlign="right">
              فلترة
            </Text>
          </Card>
          {filteredDonations.map((donation, index) => (
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
      </Container>

      <Modal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        title="اختر الموقع"
      >
        <View className="gap-2">
          {locations.map((location) => (
            <TouchableOpacity
              key={location}
              onPress={() => handleLocationSelect(location)}
            >
              <Card
                className={`${
                  selectedLocation === location ||
                  (!selectedLocation && location === "جميع المناطق")
                    ? "border-primary-400 border-2"
                    : ""
                }`}
              >
                <Text
                  size="2xs"
                  weight={
                    selectedLocation === location ||
                    (!selectedLocation && location === "جميع المناطق")
                      ? "bold"
                      : "light"
                  }
                  color={
                    selectedLocation === location ||
                    (!selectedLocation && location === "جميع المناطق")
                      ? "primary"
                      : undefined
                  }
                  rtlAlign="left"
                >
                  {location}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </Container>
  );
};

export default DonationsScreen;
