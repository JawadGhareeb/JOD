import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { daysUntil } from "@/src/utils/date";
import { formatCurrency, toPercent } from "@/src/utils/formatters";

const lifecycleLabel: Record<"active" | "completed", string> = {
  active: "نشطة",
  completed: "مكتملة",
};

export const DonationDetailsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    donations,
    jobs,
    currentPublisherId,
    followedDonationIds,
    submittedDonationProofIds,
    toggleFollowDonation,
    submitDonationProof,
  } = useAppData();

  const donation = donations.find((item) => item.id === id);

  if (!donation) {
    return (
      <View className="flex-1 items-center justify-center bg-jod-background px-4">
        <Text className="text-right font-noto-bold text-lg text-jod-text">
          الحملة غير موجودة
        </Text>
      </View>
    );
  }

  const percent = toPercent(donation.raisedAmount, donation.goalAmount);
  const remainingDays = daysUntil(donation.endDate);
  const isFollowing = followedDonationIds.includes(donation.id);
  const hasProof = submittedDonationProofIds.includes(donation.id);
  const fallbackPublisherName = jobs.find(
    (item) => item.publisherId === donation.publisherId,
  )?.orgName;
  const publisherName =
    donation.orgName ||
    fallbackPublisherName ||
    (donation.publisherId === currentPublisherId ? "الناشر الحالي" : "جهة خيرية");

  const openDonationChannel = async () => {
    if (!donation.donationChannelUrl) {
      Alert.alert("قناة التبرع", `قناة التبرع: ${donation.donationChannelLabel}`);
      return;
    }

    const canOpen = await Linking.canOpenURL(donation.donationChannelUrl);
    if (!canOpen) {
      Alert.alert("تعذر فتح الرابط", donation.donationChannelLabel);
      return;
    }

    await Linking.openURL(donation.donationChannelUrl);
  };

  const onSubmitProof = () => {
    submitDonationProof(donation.id);
    Alert.alert("تم الإرسال", "تم إرسال إثبات التبرع وسيظهر في سجل الحملة.");
  };

  return (
    <ScrollView
      className="flex-1 bg-jod-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <View className="gap-4 px-4">
        <View className="flex-row-reverse items-center gap-2">
          <TypeChip type="donation" />
          <StatusBadge status={donation.statusTag} />
        </View>

        <Text className="text-right font-noto-bold text-xl text-jod-text">
          {donation.title}
        </Text>

        <Text className="text-right font-noto leading-7 text-jod-text-secondary">
          {donation.description}
        </Text>

        <Pressable
          className="flex-row-reverse items-center justify-between rounded-xl border border-jod-border bg-jod-surface p-4"
          onPress={() => router.push(ROUTES.publisherProfile(donation.publisherId))}
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
          <Text className="text-right font-noto text-sm text-jod-text">{`الحالة: ${lifecycleLabel[donation.campaignStatus]}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`الجهة: ${donation.orgName}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المدينة: ${donation.city}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`ينتهي في: ${new Date(donation.endDate).toLocaleDateString("ar-SA")}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المتبقي: ${remainingDays >= 0 ? `${remainingDays} أيام` : "انتهت"}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`تم جمع ${formatCurrency(donation.raisedAmount)} من ${formatCurrency(donation.goalAmount)} (${percent}%)`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المتابعون: ${donation.followersCount}`}</Text>
        </View>

        {donation.campaignStatus === "completed" ? (
          <View className="gap-2 rounded-xl border border-jod-border bg-[#ECF8F0] p-4">
            <Text className="text-right font-noto-bold text-sm text-jod-success">
              نتائج الحملة
            </Text>
            <Text className="text-right font-noto text-sm text-jod-text-secondary">
              {donation.resultSummary ?? "تم إغلاق الحملة بنجاح."}
            </Text>
            {donation.resultBeneficiaries ? (
              <Text className="text-right font-noto-semibold text-sm text-jod-text">
                عدد المستفيدين: {donation.resultBeneficiaries}
              </Text>
            ) : null}

            <Pressable
              className="mt-1 items-center justify-center rounded-xl border border-jod-success px-4 py-3"
              onPress={() => router.push(ROUTES.campaignResults(donation.id))}
            >
              <Text className="font-noto-semibold text-sm text-jod-success">
                عرض صفحة النتائج
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View className="flex-row-reverse gap-2">
          <Pressable
            className={`flex-1 items-center justify-center rounded-xl border px-4 py-3 ${
              isFollowing
                ? "border-jod-primary bg-jod-primary"
                : "border-jod-border bg-jod-surface"
            }`}
            onPress={() => toggleFollowDonation(donation.id)}
          >
            <Text
              className={`font-noto-bold text-sm ${
                isFollowing ? "text-white" : "text-jod-text"
              }`}
            >
              {isFollowing ? "تتابع الحملة" : "متابعة الحملة"}
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 items-center justify-center rounded-xl border border-jod-border bg-jod-surface px-4 py-3"
            onPress={onSubmitProof}
          >
            <Text className="font-noto-semibold text-sm text-jod-text">
              {hasProof ? "تم رفع الإثبات" : "رفع إثبات التبرع"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          className="items-center justify-center rounded-xl bg-jod-primary px-4 py-3"
          onPress={openDonationChannel}
        >
          <Text className="font-noto-bold text-sm text-white">
            التبرع عبر القناة الخارجية
          </Text>
        </Pressable>

        <Text className="text-right font-noto text-xs leading-6 text-jod-muted">
          ملاحظة: منصة جود ليست بوابة دفع مباشرة. سيتم تحويلك إلى القناة المعتمدة من
          الجهة الناشرة لإتمام التبرع.
        </Text>
      </View>
    </ScrollView>
  );
};
