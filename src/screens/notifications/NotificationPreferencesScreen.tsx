import { Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";

export const NotificationPreferencesScreen = () => {
  const insets = useSafeAreaInsets();
  const { notificationPreferences, updateNotificationPreference, setDoNotDisturb } =
    useAppData();

  return (
    <View className="flex-1 bg-jod-background px-4" style={{ paddingTop: insets.top + 8 }}>
      <Text className="mb-4 text-right font-noto-bold text-xl text-jod-text">
        تفضيلات الإشعارات
      </Text>

      <View className="gap-3 rounded-xl border border-jod-border bg-jod-surface p-4">
        <PreferenceRow
          label="إشعارات الحملات"
          value={notificationPreferences.campaign}
          onChange={(value) => updateNotificationPreference("campaign", value)}
        />
        <PreferenceRow
          label="إشعارات المنشورات"
          value={notificationPreferences.post}
          onChange={(value) => updateNotificationPreference("post", value)}
        />
        <PreferenceRow
          label="إشعارات البلاغات"
          value={notificationPreferences.report}
          onChange={(value) => updateNotificationPreference("report", value)}
        />
        <PreferenceRow
          label="إشعارات النظام"
          value={notificationPreferences.system}
          onChange={(value) => updateNotificationPreference("system", value)}
        />
      </View>

      <View className="mt-4 gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
        <PreferenceRow
          label="وضع عدم الإزعاج"
          value={notificationPreferences.doNotDisturb}
          onChange={setDoNotDisturb}
        />
        <Text className="text-right font-noto text-xs leading-6 text-jod-muted">
          عند تفعيل هذا الوضع سيتم كتم التنبيهات غير العاجلة مؤقتاً.
        </Text>
      </View>
    </View>
  );
};

const PreferenceRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <View className="flex-row-reverse items-center justify-between">
    <Text className="font-noto text-sm text-jod-text">{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      thumbColor="#FFFFFF"
      trackColor={{ true: "#15616D", false: "#C5D2DE" }}
    />
  </View>
);
