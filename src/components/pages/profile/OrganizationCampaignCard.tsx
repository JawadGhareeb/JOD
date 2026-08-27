import { Image, View } from "react-native";
import { useRouter } from "expo-router";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type { Campaign } from "@/src/features/posts/types";

export function OrganizationCampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const progress = campaign.goalAmount > 0
    ? Math.min(100, Math.max(0, (campaign.raisedAmount / campaign.goalAmount) * 100))
    : 0;

  return (
    <Card padding="none" className="mb-3 overflow-hidden border-gray-200 dark:border-dark-400" onPress={() => router.push(`/campaigns/${campaign.id}` as never)} accessibilityRole="button" accessibilityLabel={`فتح حملة ${campaign.title}`}>
      {campaign.images[0] ? (
        <Image source={{ uri: campaign.images[0] }} className="h-40 w-full bg-gray-100 dark:bg-dark-350" resizeMode="cover" />
      ) : null}
      <View className="p-4">
        <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
          {campaign.title}
        </Text>
        <Text numberOfLines={3} size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
          {campaign.summary || campaign.content}
        </Text>
        {campaign.location ? (
          <Text size="2xs" className="mt-2 text-gray-500 dark:text-gray-300">
            {campaign.location}
          </Text>
        ) : null}

        {campaign.goalAmount > 0 ? (
          <View className="mt-4">
            <View className="mb-2 flex-row-reverse items-center justify-between">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                تم جمع {campaign.raisedAmount.toLocaleString("ar-SY")}
              </Text>
              <Text size="2xs" weight="semibold" className="text-primary-400">
                {Math.round(progress)}%
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-350">
              <View className="h-full rounded-full bg-primary-400" style={{ width: `${progress}%` }} />
            </View>
            <Text size="2xs" className="mt-2 text-gray-500 dark:text-gray-300">
              الهدف {campaign.goalAmount.toLocaleString("ar-SY")}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
