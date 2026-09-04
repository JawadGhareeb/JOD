import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, Tag } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import { FeedMediaGrid } from "@/src/components/shared/FeedMediaGrid";
import { FullScreenImageGallery } from "@/src/components/shared/FullScreenImageGallery";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Text from "@/src/components/ui/Text";
import { useCampaignDonors } from "@/src/features/donations/queries";
import { useCampaign } from "@/src/features/posts/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const query = useCampaign(id);
  const campaign = query.data;
  const donorsQuery = useCampaignDonors(id, { perPage: 10 });
  const donors = donorsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  if (query.isLoading) return <Container className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><Text>جارِ تحميل الحملة...</Text></Container>;
  if (!campaign || !id) return <Container className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><Text>تعذر العثور على الحملة.</Text></Container>;
  const progress = campaign.goalAmount > 0 ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100) : 0;
  const categoryName = typeof campaign.category === "string" ? campaign.category : campaign.category?.name;
  const publisherName = campaign.organizationName || campaign.publisher.name;
  return (
    <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300">
      <View className="gap-4 pb-8">
        <Text variant="heading" weight="bold" rtlAlign="right">تفاصيل الحملة</Text>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Pressable
            onPress={() => campaign.publisher.id && router.push({ pathname: "/author/[id]", params: { id: campaign.publisher.id } })}
            disabled={!campaign.publisher.id}
            className="flex-row-reverse items-center gap-3"
            accessibilityRole={campaign.publisher.id ? "button" : undefined}
          >
            <Avatar name={publisherName} imageUrl={campaign.publisher.avatarUrl} size={52} />
            <View className="flex-1 items-end">
              <View className="flex-row-reverse items-center gap-1">
                <Text size="sm" weight="semibold">{publisherName}</Text>
                {campaign.publisher.verified ? <VerifiedBadge /> : null}
              </View>
              {campaign.publisher.username ? (
                <Text size="xs" className="text-gray-500 dark:text-gray-300">@{campaign.publisher.username}</Text>
              ) : null}
            </View>
          </Pressable>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text variant="heading" weight="bold" rtlAlign="right">{campaign.title}</Text>
          <View className="flex-row-reverse flex-wrap gap-2">
            {categoryName ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-primary-100 px-3 py-1 dark:bg-primary-400/15">
                <Tag size={12} color="#4A9782" />
                <Text size="2xs" className="text-primary-400">{categoryName}</Text>
              </View>
            ) : null}
            {campaign.location ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-350">
                <MapPin size={12} color="#6B7280" />
                <Text size="2xs" className="text-gray-600 dark:text-gray-200">{campaign.location}</Text>
              </View>
            ) : null}
          </View>
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
            {campaign.raisedAmount.toLocaleString("ar-SY")} / {campaign.goalAmount.toLocaleString("ar-SY")}
          </Text>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {campaign.donorsCount} متبرع
            {campaign.beneficiariesCount > 0 ? ` • ${campaign.beneficiariesCount} مستفيد` : ""}
          </Text>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between">
            <Text size="sm" weight="semibold">المتبرعون بالحملة</Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">{campaign.donorsCount} متبرع</Text>
          </View>

          {donorsQuery.isLoading ? (
            <Text size="xs" className="text-gray-500 dark:text-gray-300">جارِ تحميل المتبرعين...</Text>
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
                      {donor.amount.toLocaleString("ar-SY")} • {donor.donatedAt ? new Date(donor.donatedAt).toLocaleDateString("ar") : "-"}
                    </Text>
                  </View>
                </View>
              ))}
              {donorsQuery.hasNextPage ? (
                <Button
                  size="small"
                  variant="tertiary"
                  loading={donorsQuery.isFetchingNextPage}
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

        {campaign.status === "active" ? (
          <Button fullWidth onPress={() => { if (!requireAuth()) return; router.push({ pathname: "/donate/[id]", params: { id } }); }}>
            تبرع للحملة
          </Button>
        ) : (
          <Button fullWidth disabled>الحملة غير متاحة للتبرع</Button>
        )}
      </View>
      <FullScreenImageGallery
        images={campaign.images}
        visible={galleryIndex !== null}
        initialIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
      />
    </Container>
  );
}
