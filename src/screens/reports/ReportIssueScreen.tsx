import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import type { ReportItem } from "@/src/types/reports";

const reasons = [
  "محتوى مضلل",
  "محتوى غير لائق",
  "احتيال",
  "انتحال شخصية",
  "معلومات ناقصة",
] as const;

export const ReportIssueScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    entityType?: ReportItem["entityType"];
    entityId?: string;
  }>();

  const entityType = params.entityType ?? "post";
  const entityId = params.entityId ?? "unknown";
  const [selectedReason, setSelectedReason] = useState<(typeof reasons)[number]>("محتوى مضلل");
  const [details, setDetails] = useState("");
  const { submitReport } = useAppData();

  const entityLabel = useMemo(() => {
    if (entityType === "campaign") return "حملة";
    if (entityType === "job") return "وظيفة";
    if (entityType === "user") return "مستخدم";
    if (entityType === "organization") return "منظمة";
    return "منشور";
  }, [entityType]);

  const onSubmit = () => {
    submitReport({
      title: `بلاغ على ${entityLabel}`,
      description: details.trim() ? `${selectedReason} - ${details.trim()}` : selectedReason,
      entityType,
      entityId,
    });
    Alert.alert("تم إرسال البلاغ", "تم استلام بلاغك وسيتم مراجعته.");
    router.replace(ROUTES.myReports);
  };

  return (
    <View className="flex-1 bg-jod-background px-4" style={{ paddingTop: insets.top + 8 }}>
      <Text className="mb-2 text-right font-noto-bold text-xl text-jod-text">إرسال بلاغ</Text>
      <Text className="mb-4 text-right font-noto text-sm text-jod-text-secondary">
        نوع الكيان: {entityLabel} - المعرف: {entityId}
      </Text>

      <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
        <Text className="text-right font-noto-semibold text-sm text-jod-text">
          سبب البلاغ
        </Text>
        <View className="flex-row-reverse flex-wrap gap-2">
          {reasons.map((reason) => (
            <Pressable
              key={reason}
              className={`rounded-full border px-3 py-2 ${
                selectedReason === reason
                  ? "border-jod-primary bg-jod-primary"
                  : "border-jod-border bg-jod-surface"
              }`}
              onPress={() => setSelectedReason(reason)}
            >
              <Text
                className={`font-noto-semibold text-xs ${
                  selectedReason === reason ? "text-white" : "text-jod-text-secondary"
                }`}
              >
                {reason}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-4 gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
        <Text className="text-right font-noto-semibold text-sm text-jod-text">
          تفاصيل إضافية
        </Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          multiline
          textAlign="right"
          placeholder="اكتب تفاصيل إضافية عن البلاغ (اختياري)"
          placeholderTextColor="#6E8190"
          className="min-h-[120px] rounded-lg border border-jod-border px-3 py-3 font-noto text-sm text-jod-text"
        />
      </View>

      <Pressable
        className="mt-6 items-center justify-center rounded-xl bg-jod-primary px-4 py-3"
        onPress={onSubmit}
      >
        <Text className="font-noto-bold text-sm text-white">إرسال البلاغ</Text>
      </Pressable>
    </View>
  );
};
