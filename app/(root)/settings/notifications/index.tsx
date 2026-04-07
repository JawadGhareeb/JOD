import { NotificationCard } from "@/components/pages";
import { Header } from "@/components/sections";
import Dialog from "@/components/ui/Dialog";
import { Images } from "@/constants";
import { useColorScheme } from "nativewind";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

const Notifications = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
  const [notifications] = useState([
    {
      id: 1,
      image: Images.subLogo,
      title: "تم قبول منشورك",
      description: "تمت مراجعة منشورك وأصبح متاحًا الآن للمستخدمين.",
      isRead: false,
    },
    {
      id: 2,
      image: Images.subLogo,
      title: "تحديث على حملة تتابعها",
      description: "تم نشر تحديث جديد على حملة دعم الأسر المحتاجة.",
      isRead: true,
    },
    {
      id: 3,
      image: Images.subLogo,
      title: "تم استلام بلاغك",
      description: "وصلنا بلاغك ويتم مراجعته من فريق الإدارة.",
      isRead: true,
    },
  ]);

  const selectedNotification = useMemo(
    () =>
      notifications.find(
        (notification) => notification.id === selectedNotificationId,
      ),
    [notifications, selectedNotificationId],
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="الإشعارات" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 22,
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
              onPress={() => setSelectedNotificationId(notification.id)}
            />
          ))}
        </View>
      </ScrollView>

      <Dialog
        visible={selectedNotificationId !== null}
        onClose={() => setSelectedNotificationId(null)}
        title={selectedNotification?.title}
        message={selectedNotification?.description}
        buttons={[
          {
            text: "إغلاق",
            onPress: () => setSelectedNotificationId(null),
          },
        ]}
      />
    </View>
  );
};

export default Notifications;
