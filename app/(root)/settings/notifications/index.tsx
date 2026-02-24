import { NotificationCard } from "@/components/pages";
import { Header } from "@/components/sections";
import { Images } from "@/constants";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

const Notifications = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [notifications] = useState([
    {
      id: 2,
      image: Images.subLogo,
      title: "تم إنجاز اختبار العلوم",
      description: "تهانينا! لقد أكملت اختبار العلوم بنجاح وحصلت على 85%",
      isRead: false,
    },

    {
      id: 4,
      image: Images.subLogo,
      title: "إنجاز جديد: 10 اختبارات مكتملة",
      description: "لقد أكملت 10 اختبارات بنجاح! استمر في التقدم",
      isRead: true,
    },
  ]);

  const handleNotificationPress = (notificationId: number) => {
    console.log("Notification pressed:", notificationId);
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="الإشعارات" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <View>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              image={notification.image}
              title={notification.title}
              description={notification.description}
              isRead={notification.isRead}
              onPress={() => handleNotificationPress(notification.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;
