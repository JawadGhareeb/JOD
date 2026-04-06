import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";
import { formatCurrency, toPercent } from "@/src/utils/formatters";

export const CampaignResultsScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { donations } = useAppData();

  const campaign = donations.find((item) => item.id === id);

  if (!campaign) {
    return (
      <View className="flex-1 items-center justify-center bg-jod-background px-4">
        <Text className="text-right font-noto-bold text-lg text-jod-text">
          الحملة غير موجودة
        </Text>
      </View>
    );
  }

  const percent = toPercent(campaign.raisedAmount, campaign.goalAmount);

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
          نتائج الحملة
        </Text>

        <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto-bold text-base text-jod-text">
            {campaign.title}
          </Text>
          <Text className="text-right font-noto text-sm text-jod-text-secondary">{`الجهة: ${campaign.orgName}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text-secondary">{`المدينة: ${campaign.city}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text-secondary">{`إجمالي المحصل: ${formatCurrency(campaign.raisedAmount)}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text-secondary">{`الهدف: ${formatCurrency(campaign.goalAmount)}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text-secondary">{`نسبة الإنجاز: ${percent}%`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text-secondary">{`المتابعون: ${campaign.followersCount}`}</Text>
          {campaign.resultBeneficiaries ? (
            <Text className="text-right font-noto text-sm text-jod-text-secondary">{`عدد المستفيدين: ${campaign.resultBeneficiaries}`}</Text>
          ) : null}
        </View>

        <View className="rounded-xl border border-jod-border bg-[#ECF8F0] p-4">
          <Text className="text-right font-noto-semibold text-sm text-jod-success">
            الملخص الختامي
          </Text>
          <Text className="mt-2 text-right font-noto leading-7 text-sm text-jod-text-secondary">
            {campaign.resultSummary ?? "تمت الحملة بنجاح وتم تسليم الدعم للمستفيدين."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
