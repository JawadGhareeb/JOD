import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/src/components/ui/Button";
import Dialog from "@/src/components/ui/Dialog";
import { appIcons } from "./iconMap";

const CloseIcon = appIcons.close;
const CreatePostIcon = appIcons.createPost;
const DonationsIcon = appIcons.myDonations;
const SavedPostsIcon = appIcons.savedPosts;
const LogoutIcon = appIcons.logout;

type AppSidebarProps = {
  visible: boolean;
  onClose: () => void;
};

const menuItems = [
  { key: "create-post", label: "نشر بوست", Icon: CreatePostIcon },
  { key: "my-donations", label: "تبرعاتي", Icon: DonationsIcon },
  { key: "saved-posts", label: "بوستات محفوظة", Icon: SavedPostsIcon },
] as const;

export function AppSidebar({ visible, onClose }: AppSidebarProps) {
  const insets = useSafeAreaInsets();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const closeSidebar = () => {
    setIsLogoutDialogOpen(false);
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50">
      <Pressable
        className="absolute inset-0 bg-black/25"
        onPress={closeSidebar}
        accessibilityRole="button"
        accessibilityLabel="إغلاق القائمة الجانبية"
      />

      <View
        style={{
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 12),
        }}
        className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] border-l border-gray-200 bg-white px-4"
      >
        <View className="flex-1">
          <View className="flex-row-reverse items-center justify-between pb-4">
            <Text className="font-noto-semibold text-lg text-dark-100">القائمة</Text>
            <Pressable
              onPress={closeSidebar}
              className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
            >
              <CloseIcon size={20} color="#405d72" strokeWidth={2.25} />
            </Pressable>
          </View>

          <View className="mt-3 gap-2">
            {menuItems.map((item) => (
              <Pressable
                key={item.key}
                className="flex-row-reverse items-center justify-start gap-2 rounded-xl px-3 py-3"
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <item.Icon size={18} color="#405d72" strokeWidth={2.25} />
                <Text className="font-noto-medium text-sm text-dark-100">{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-auto pt-4">
            <Button
              fullWidth
              variant="outline"
              leftIcon={<LogoutIcon size={18} color="#405d72" strokeWidth={2.25} />}
              onPress={() => setIsLogoutDialogOpen(true)}
            >
              تسجيل الخروج
            </Button>
          </View>
        </View>
      </View>

      <Dialog
        visible={isLogoutDialogOpen}
        title="تأكيد تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        onClose={() => setIsLogoutDialogOpen(false)}
        buttons={[
          {
            text: "إلغاء",
            variant: "tertiary",
            onPress: () => setIsLogoutDialogOpen(false),
          },
          {
            text: "تسجيل الخروج",
            variant: "primary",
            onPress: closeSidebar,
          },
        ]}
      />
    </View>
  );
}
