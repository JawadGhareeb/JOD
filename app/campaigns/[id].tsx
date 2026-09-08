import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, MapPin, Tag } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import { FeedMediaGrid } from "@/src/components/shared/FeedMediaGrid";
import { FullScreenImageGallery } from "@/src/components/shared/FullScreenImageGallery";
import { showOrganizationVerifiedBadge, VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import { CampaignDetailsSkeleton, CampaignDonorRowSkeleton } from "@/src/components/pages/campaigns/CampaignDetailsSkeleton";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Text from "@/src/components/ui/Text";
import { useCampaignDonors, useDonations } from "@/src/features/donations/queries";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useCampaign, useLikeCampaign } from "@/src/features/posts/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import {
  formatWesternNumber,
  localizeCategoryName,
  localizeSyrianLocation,
} from "@/src/helpers/display";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const { isAuthenticated } = useAuthStatus();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const query = useCampaign(id);
  const likeMutation = useLikeCampaign();
  const campaign = query.data;
  const myDonationsQuery = useDonations(
    { campaignId: id, perPage: 10 },
    { enabled: isAuthenticated && Boolean(id) },
  );
  const myDonation = myDonationsQuery.data?.pages
    .flatMap((page) => page.items)
    .find((item) => item.status !== "cancelled");
  const donorsQuery = useCampaignDonors(id, { perPage: 10 });
  const donors = donorsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  if (query.isLoading) return <CampaignDetailsSkeleton />;
  if (!campaign || !id) {
    return (
      <Container className="bg-light-100 px-4 dark:bg-dark-300">
        <MenuPageHeader title="تفاصيل الحملة" />
        <Text>تعذر العثور على الحملة.</Text>
      </Container>
    );
  }

  const progress = campaign.goalAmount > 0
    ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)
    : 0;
  const categoryName = typeof campaign.category === "string" ? campaign.category : campaign.category?.name;
  const publisherName = campaign.organizationName || campaign.publisher.name;

  return (
    <Container
      scrollable
      className="bg-light-100 dark:bg-dark-300"
      scrollViewProps={{
        contentContainerStyle: {
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 36,
          gap: 8,
        },
      }}
    >
        <MenuPageHeader title="تفاصيل الحملة" />

        <Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400">
          <Text variant="heading" weight="bold" rtlAlign="right">{campaign.title}</Text>
          <View className="flex-row-reverse flex-wrap gap-2">
            {categoryName ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-primary-100 px-3 py-1 dark:bg-primary-400/15">
                <Tag size={12} color="#4A9782" />
                <Text size="2xs" className="text-primary-400">{localizeCategoryName(categoryName)}</Text>
              </View>
            ) : null}
            {campaign.location ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-350">
                <MapPin size={12} color="#6B7280" />
                <Text size="2xs" className="text-gray-600 dark:text-gray-200">{localizeSyrianLocation(campaign.location)}</Text>
              </View>
            ) : null}
          </View>

          <Pressable
            onPress={() => campaign.publisher.id && router.push({ pathname: "/author/[id]", params: { id: campaign.publisher.id } })}
            disabled={!campaign.publisher.id}
            className="flex-row-reverse items-center gap-3 border-t border-gray-100 pt-3 dark:border-dark-400"
            accessibilityRole={campaign.publisher.id ? "button" : undefined}
          >
            <Avatar name={publisherName} imageUrl={campaign.publisher.avatarUrl} size={48} />
            <View className="flex-1 items-end">
              <View className="flex-row-reverse items-center gap-1">
                <Text size="sm" weight="semibold">{publisherName}</Text>
                {showOrganizationVerifiedBadge(campaign.publisher, { assumeOrganization: true }) ? (
                  <VerifiedBadge />
                ) : null}
              </View>
              {campaign.publisher.username ? (
                <Text size="xs" className="text-gray-500 dark:text-gray-300">@{campaign.publisher.username}</Text>
              ) : null}
            </View>
          </Pressable>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text size="sm" weight="semibold">الوصف</Text>
          {campaign.summary ? <Text size="sm" weight="medium" className="leading-7">{campaign.summary}</Text> : null}
          {campaign.content ? <Text size="sm" className="leading-7">{campaign.content}</Text> : null}
          <FeedMediaGrid images={campaign.images} onPress={(index) => setGalleryIndex(index)} />
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between">
            <Text size="xs" weight="semibold">تقدم الحملة</Text>
            <Text size="sm" weight="bold" className="text-primary-400">{progress.toFixed(0)}%</Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-350">
            <View className="h-full rounded-full bg-primary-400" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
          </View>
          <Text size="sm" className="text-primary-400">
            {formatWesternNumber(campaign.raisedAmount)} / {formatWesternNumber(campaign.goalAmount)}
          </Text>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {formatWesternNumber(campaign.donorsCount)} متبرع
            {campaign.beneficiariesCount > 0 ? ` • ${formatWesternNumber(campaign.beneficiariesCount)} مستفيد` : ""}
          </Text>
          <Pressable
            onPress={() => {
              if (!requireAuth() || likeMutation.isPending) return;
              void likeMutation.mutateAsync({ campaignId: campaign.id, like: !Boolean(campaign.isLiked) });
            }}
            disabled={likeMutation.isPending}
            accessibilityRole="button"
            accessibilityLabel={campaign.isLiked ? "إلغاء الإعجاب بالحملة" : "إعجاب بالحملة"}
            className="self-end flex-row-reverse items-center gap-2 rounded-full bg-gray-50 px-3 py-2 dark:bg-dark-350"
          >
            <Heart size={18} color={campaign.isLiked ? "#E5484D" : "#9CA3AF"} fill={campaign.isLiked ? "#E5484D" : "transparent"} />
            <Text size="2xs" className={campaign.isLiked ? "text-error-300" : "text-gray-500 dark:text-gray-300"}>{formatWesternNumber(campaign.stats.likes)}</Text>
          </Pressable>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between">
            <Text size="sm" weight="semibold">المتبرعون بالحملة</Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">{formatWesternNumber(campaign.donorsCount)} متبرع</Text>
          </View>

          {donorsQuery.isLoading ? (
            <View className="gap-2">
              <CampaignDonorRowSkeleton />
              <CampaignDonorRowSkeleton />
            </View>
          ) : donorsQuery.isError ? (
            <View className="gap-2">
              <Text size="xs" className="text-error-300">تعذر تحميل المتبرعين.</Text>
              <Button size="small" variant="tertiary" onPress={() => void donorsQuery.refetch()}>إعادة المحاولة</Button>
            </View>
          ) : donors.length ? (
            <View className="gap-2">
              {donors.map((donor) => (
                <View key={donor.id} className="flex-row-reverse items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-dark-350">
                  <Avatar name={donor.name} imageUrl={donor.isAnonymous ? null : donor.avatarUrl} size={40} />
                  <View className="flex-1 items-end">
                    <View className="flex-row-reverse items-center gap-2">
                      <Text size="xs" weight="semibold">{donor.isAnonymous ? "مجهول" : donor.name}</Text>
                      {donor.isAnonymous ? (
                        <View className="rounded-full bg-gray-200 px-2 py-0.5 dark:bg-dark-400">
                          <Text size="2xs" className="text-gray-500 dark:text-gray-300">تبرع مجهول</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                      {formatWesternNumber(donor.amount)} • {donor.donatedAt ? new Date(donor.donatedAt).toLocaleDateString("en-GB") : "-"}
                    </Text>
                  </View>
                </View>
              ))}
              {donorsQuery.isFetchingNextPage ? (
                <View className="gap-2">
                  <CampaignDonorRowSkeleton />
                  <CampaignDonorRowSkeleton />
                </View>
              ) : null}
              {donorsQuery.hasNextPage ? (
                <Button
                  size="small"
                  variant="tertiary"
                  disabled={donorsQuery.isFetchingNextPage}
                  onPress={() => void donorsQuery.fetchNextPage()}
                >
                  عرض المزيد من المتبرعين
                </Button>
              ) : null}
            </View>
          ) : (
            <Text size="xs" className="text-gray-500 dark:text-gray-300">لا توجد تبرعات مكتملة بعد.</Text>
          )}
        </Card>

        {myDonation ? (
          <Button
            fullWidth
            onPress={() =>
              router.push({ pathname: "/donations/[id]", params: { id: myDonation.id } })
            }
          >
            عرض تفاصيل التبرع
          </Button>
        ) : campaign.status === "active" ? (
          <Button
            fullWidth
            disabled={isAuthenticated && myDonationsQuery.isLoading}
            onPress={() => {
              if (!requireAuth()) return;
              router.push({ pathname: "/donate/[id]", params: { id } });
            }}
          >
            تبرع للحملة
          </Button>
        ) : (
          <Button fullWidth disabled>الحملة غير متاحة للتبرع</Button>
        )}

      <FullScreenImageGallery
        images={campaign.images}
        visible={galleryIndex !== null}
        initialIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
      />
    </Container>
  );
}
