import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";

const joinStatusLabel = {
  not_joined: "لم تنضم بعد",
  pending: "طلبك قيد المراجعة",
  accepted: "تم قبول طلبك",
} as const;

const joinButtonLabel = {
  not_joined: "انضم للحملة",
  pending: "قيد المراجعة",
  accepted: "تم القبول",
} as const;

export const VolunteerDetailsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    volunteeringCampaigns,
    donations,
    jobs,
    currentPublisherId,
    requestVolunteerJoin,
  } = useAppData();

  const campaign = volunteeringCampaigns.find((item) => item.id === id);

  if (!campaign) {
    return (
      <View className="flex-1 items-center justify-center bg-jod-background px-4">
        <Text className="text-right font-noto-bold text-lg text-jod-text">
          الحملة غير موجودة
        </Text>
      </View>
    );
  }

  const remainingSeats = Math.max(
    campaign.requiredVolunteers - campaign.joinedVolunteers,
    0,
  );

  const fallbackPublisherName =
    donations.find((item) => item.publisherId === campaign.publisherId)?.orgName ||
    jobs.find((item) => item.publisherId === campaign.publisherId)?.orgName;
  const publisherName =
    fallbackPublisherName ||
    (campaign.publisherId === currentPublisherId ? "الناشر الحالي" : "جهة خيرية");

  const isJoinDisabled =
    campaign.joinStatus === "pending" || campaign.joinStatus === "accepted";

  const onJoinPress = () => {
    if (campaign.joinStatus === "not_joined") {
      requestVolunteerJoin(campaign.id);
      Alert.alert("تم إرسال الطلب", "تم إرسال طلب الانضمام للحملة التطوعية.");
      return;
    }
  };

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
        <View className="flex-row-reverse items-center gap-2">
          <TypeChip type="volunteer" />
          <StatusBadge status={campaign.statusTag} />
        </View>

        <Text className="text-right font-noto-bold text-xl text-jod-text">
          {campaign.title}
        </Text>
        <Text className="text-right font-noto leading-7 text-jod-text-secondary">
          {campaign.description}
        </Text>

        <Pressable
          className="flex-row-reverse items-center justify-between rounded-xl border border-jod-border bg-jod-surface p-4"
          onPress={() => router.push(ROUTES.publisherProfile(campaign.publisherId))}
        >
          <View className="flex-1">
            <Text className="text-right font-noto-bold text-sm text-jod-text">
              {publisherName}
            </Text>
            <Text className="text-right font-noto text-xs text-jod-muted">
              الجهة الناشرة - عرض الملف والمنشورات
            </Text>
          </View>
          <Text className="font-noto-semibold text-xs text-jod-primary">عرض الملف</Text>
        </Pressable>

        <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto text-sm text-jod-text">{`الحالة: ${
            campaign.campaignStatus === "active" ? "نشطة" : "مكتملة"
          }`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المدينة: ${campaign.city}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`التاريخ: ${campaign.date}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`الوقت: ${campaign.time}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المطلوب: ${campaign.requiredVolunteers}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المنضمون: ${campaign.joinedVolunteers}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المقاعد المتبقية: ${remainingSeats}`}</Text>
          <Text className="text-right font-noto-semibold text-sm text-jod-primary">{`حالة الطلب: ${joinStatusLabel[campaign.joinStatus]}`}</Text>
        </View>

        <Pressable
          disabled={isJoinDisabled}
          className={`items-center justify-center rounded-xl px-4 py-3 ${
            isJoinDisabled ? "bg-[#C8D5DB]" : "bg-jod-primary"
          }`}
          onPress={onJoinPress}
        >
          <Text className="font-noto-bold text-sm text-white">
            {joinButtonLabel[campaign.joinStatus]}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
