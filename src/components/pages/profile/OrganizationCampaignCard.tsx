import { useState } from "react";
import { useRouter } from "expo-router";
import { MapPin, Tag } from "lucide-react-native";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import { FeedMediaGrid } from "@/src/components/shared/FeedMediaGrid";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type { Campaign } from "@/src/features/posts/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";

const MAX_CONTENT = 180;

export function OrganizationCampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const [expanded, setExpanded] = useState(false);
  const progress = campaign.goalAmount > 0
    ? Math.min(100, Math.max(0, (campaign.raisedAmount / campaign.goalAmount) * 100))
    : 0;
  const content = campaign.summary || campaign.content || "";
  const shouldTruncate = content.length > MAX_CONTENT;
  const displayContent = expanded || !shouldTruncate
    ? content
    : `${content.slice(0, MAX_CONTENT).trim()}...`;
  const categoryName = typeof campaign.category === "string" ? campaign.category : campaign.category?.name;

  const openPublisherProfile = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!campaign.publisher.id || !requireAuth()) return;
    router.push({ pathname: "/author/[id]", params: { id: campaign.publisher.id } });
  };

  const handleDetails = (event: GestureResponderEvent) => {
    event.stopPropagation();
    router.push(`/campaigns/${campaign.id}` as never);
  };

  return (
    <Card
      padding="md"
      className="mb-3 border-gray-200 dark:border-dark-400"
      onPress={() => router.push(`/campaigns/${campaign.id}` as never)}
      accessibilityRole="button"
      accessibilityLabel={`فتح حملة ${campaign.title}`}
    >
      <Pressable
        onPress={openPublisherProfile}
        className="flex-row-reverse items-center gap-2"
        accessibilityRole="button"
        accessibilityLabel={`عرض الملف الشخصي للناشر ${campaign.publisher.name}`}
      >
        <Avatar name={campaign.publisher.name} imageUrl={campaign.publisher.avatarUrl} size={42} />
        <View className="flex-1 items-end">
          <View className="flex-row-reverse items-center gap-1">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {campaign.publisher.name}
            </Text>
            {campaign.publisher.verified ? <VerifiedBadge /> : null}
          </View>
          <Text size="2xs" className="mt-0.5 text-gray-500 dark:text-gray-300">
            @{campaign.publisher.username}
          </Text>
        </View>
      </Pressable>

      <Text weight="semibold" size="sm" className="mt-3 text-dark-100 dark:text-light-50">
        {campaign.title}
      </Text>
      <Text size="sm" className="mt-2 leading-7 text-dark-100 dark:text-light-50">
        {displayContent}
      </Text>
      {shouldTruncate ? (
        <Pressable
          onPress={(event) => { event.stopPropagation(); setExpanded((value) => !value); }}
          className="mt-1 self-end"
        >
          <Text size="xs" weight="semibold" className="text-primary-400">
            {expanded ? "عرض أقل" : "عرض المزيد"}
          </Text>
        </Pressable>
      ) : null}

      <View className="mt-2 flex-row-reverse flex-wrap gap-2">
        {categoryName ? (
          <View className="flex-row-reverse items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 dark:bg-primary-400/15">
            <Tag size={12} color="#4A9782" strokeWidth={2.2} />
            <Text size="2xs" className="text-primary-400">{categoryName}</Text>
          </View>
        ) : null}
        {campaign.location ? (
          <View className="flex-row-reverse items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-dark-350">
            <MapPin size={12} color="#6B7280" strokeWidth={2.2} />
            <Text size="2xs" className="text-gray-600 dark:text-gray-200">{campaign.location}</Text>
          </View>
        ) : null}
      </View>

      <FeedMediaGrid
        images={campaign.images}
        onPress={() => router.push(`/campaigns/${campaign.id}` as never)}
      />

      {campaign.goalAmount > 0 ? (
        <View className="mt-4 border-t border-gray-100 pt-3 dark:border-dark-400">
          <View className="mb-2 flex-row-reverse items-center justify-between">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              تم جمع {campaign.raisedAmount.toLocaleString("ar-SY")}
            </Text>
            <Text size="2xs" weight="semibold" className="text-primary-400">{Math.round(progress)}%</Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-350">
            <View className="h-full rounded-full bg-primary-400" style={{ width: `${progress}%` }} />
          </View>
          <View className="mt-2 flex-row-reverse items-center justify-between">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              الهدف {campaign.goalAmount.toLocaleString("ar-SY")}
            </Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {campaign.donorsCount} متبرع
            </Text>
          </View>
        </View>
      ) : null}

      <View className="mt-3">
        <Button fullWidth size="small" variant="primary" onPress={handleDetails}>
          عرض التفاصيل
        </Button>
      </View>
    </Card>
  );
}
