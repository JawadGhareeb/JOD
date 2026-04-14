import { FlatList, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { mockNotificationsPayload } from "@/src/data/mockNotifications";
import { NotificationItemCard } from "./NotificationItemCard";

const BackIcon = appIcons.chevronRight;

export function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <View
        style={{ paddingTop: Math.max(insets.top, 8) }}
        className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
          accessibilityRole="button"
          accessibilityLabel="رجوع"
        >
          <BackIcon size={20} color="#405d72" strokeWidth={2.25} />
        </Pressable>

        <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
          الإشعارات
        </Text>

        <View className="h-10 w-10" />
      </View>

      <FlatList
        data={mockNotificationsPayload.notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItemCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              لا توجد إشعارات حالياً.
            </Text>
          </View>
        }
      />
    </View>
  );
}
