import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES } from "@/constants/routers";
import { useAppData } from "@/src/context";
import { formatCurrency } from "@/src/utils/formatters";

const quickLinks = [
  {
    label: "طلباتي الوظيفية",
    path: ROUTES.ROOT.MY_APPLICATIONS,
    icon: "work-history",
  },
  { label: "بلاغاتي", path: ROUTES.ROOT.MY_REPORTS, icon: "flag" },
  { label: "الإشعارات", path: ROUTES.SETTINGS.NOTIFICATIONS, icon: "notifications" },
  { label: "المنشورات المحفوظة", path: ROUTES.SETTINGS.SAVED_POSTS, icon: "bookmark" },
  { label: "منشوراتي", path: ROUTES.SETTINGS.MY_POSTS, icon: "article" },
  { label: "الدعم", path: ROUTES.SETTINGS.SUPPORT, icon: "support-agent" },
] as const;

export const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userRole, setUserRole, publisherStats } = useAppData();

  return (
    <ScrollView
      className="flex-1 bg-jod-background"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 px-4">
        <Text className="text-right font-noto-bold text-xl text-jod-text">
          الملف الشخصي
        </Text>

        <View className="gap-1 rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto-bold text-base text-jod-text">
            مستخدم تجريبي
          </Text>
          <Text className="text-right font-noto text-xs text-jod-muted">
            user@jod.app
          </Text>
        </View>

        <View className="gap-3 rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto-semibold text-sm text-jod-text">
            الدور الحالي
          </Text>

          <View className="flex-row-reverse items-center justify-between">
            <Text className="font-noto text-sm text-jod-text-secondary">ناشر</Text>
            <Switch
              value={userRole === "publisher"}
              onValueChange={(value) => setUserRole(value ? "publisher" : "user")}
              thumbColor="#FFFFFF"
              trackColor={{ true: "#15616D", false: "#C5D2DE" }}
            />
            <Text className="font-noto text-sm text-jod-text-secondary">مستخدم</Text>
          </View>
        </View>

        {userRole === "publisher" ? (
          <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
            <Text className="text-right font-noto-semibold text-sm text-jod-text">
              لوحة الناشر
            </Text>

            <StatCard label="حملاتي" value={publisherStats.myCampaignsCount.toString()} />
            <StatCard
              label="إجمالي المحصل"
              value={formatCurrency(publisherStats.totalRaised)}
            />
            <StatCard label="المتقدمون" value={publisherStats.applicants.toString()} />
          </View>
        ) : null}

        <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-2">
          {quickLinks.map((item) => (
            <Pressable
              key={item.path}
              className="flex-row-reverse items-center justify-between rounded-lg px-2 py-3"
              onPress={() => router.push(item.path as any)}
            >
              <View className="flex-row-reverse items-center gap-2">
                <MaterialIcons
                  name={item.icon as any}
                  size={18}
                  color="#4F6375"
                />
                <Text className="font-noto-semibold text-sm text-jod-text">
                  {item.label}
                </Text>
              </View>
              <MaterialIcons name="chevron-left" size={20} color="#6E8190" />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View className="rounded-lg border border-jod-border bg-[#F7FAFD] px-3 py-2">
    <Text className="text-right font-noto-bold text-sm text-jod-text">{value}</Text>
    <Text className="text-right font-noto text-xs text-jod-text-secondary">
      {label}
    </Text>
  </View>
);
