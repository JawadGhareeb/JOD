import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { mainImage } from "@/src/constants/images";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Container from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { FeedMediaGrid } from "@/src/components/shared/FeedMediaGrid";
import { FullScreenImageGallery } from "@/src/components/shared/FullScreenImageGallery";
import { VideoPlayer } from "@/src/components/shared/VideoPlayer";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import {
  getPostActionLabel,
  getPostActionStateLabel,
  getPostDisplayTitle,
  openPostContact,
} from "@/src/features/posts/contact";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import { useCampaign, usePost } from "@/src/features/posts/queries";
import { useDonations } from "@/src/features/donations/queries";
import { useAuthStatus } from "@/src/features/auth/queries";
import { HomePostTypeEnum } from "@/src/constants/global";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import {
  formatWesternNumber,
  localizeCategoryName,
  localizeSyrianLocation,
} from "@/src/helpers/display";

const PlayIcon = appIcons.play;

const HELP_STATUS_LABELS = {
  open: "مفتوح",
  in_progress: "قيد التواصل",
  fulfilled: "مُلبّى",
  partially_fulfilled: "مُلبّى جزئياً",
  not_fulfilled: "لم تتم التلبية",
  expired: "منتهي",
} as const;

const HELP_AVAILABILITY_LABELS = {
  available: "تقديم مساعدة",
  login_required: "تقديم مساعدة",
  existing_offer: "متابعة عرض المساعدة",
  final_agreement: "تم الاتفاق مع مقدم مساعدة",
  fulfilled: "تمت تلبية طلب المساعدة",
  partially_fulfilled: "تمت تلبية الطلب جزئياً",
  not_fulfilled: "أُغلق الطلب دون تلبية",
  expired: "انتهت صلاحية طلب المساعدة",
  not_eligible: "لا يمكنك تقديم مساعدة لهذا الطلب",
} as const;

export default function PostDetailsPage() {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const { isAuthenticated } = useAuthStatus();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const { data: post, isLoading, isError } = usePost(postId);
  const { data: campaign } = useCampaign(post?.campaignId);
  const donationCampaignId =
    post?.cta.type === "donate" ? post.cta.targetId ?? post.campaignId ?? undefined : undefined;
  const myDonationsQuery = useDonations(
    { campaignId: donationCampaignId, perPage: 10 },
    {
      enabled:
        isAuthenticated &&
        post?.cta.type === "donate" &&
        Boolean(donationCampaignId),
    },
  );
  const myDonation = myDonationsQuery.data?.pages
    .flatMap((page) => page.items)
    .find((item) => item.status !== "cancelled");
  const isHelp = post?.postType === HomePostTypeEnum.HelpRequest;

  const handlePrimaryAction = async () => {
    if (!post) return;

    if (isHelp) {
      if (post.myOffer) {
        if (!requireAuth()) return;
        router.push({ pathname: "/help-offers/[id]", params: { id: post.myOffer.id } });
        return;
      }
      if (post.helpOfferAvailability === "login_required" || (!isAuthenticated && post.cta.state === "open")) {
        requireAuth();
        return;
      }
      if (!requireAuth()) return;
      if (post.canOfferHelp || post.helpOfferAvailability === "available") {
        router.push({ pathname: "/help-offers/create/[postId]", params: { postId: post.id } });
      }
      return;
    }

    if (post.cta.type === "donate") {
      if (!requireAuth()) return;
      if (myDonation) {
        router.push({ pathname: "/donations/[id]", params: { id: myDonation.id } });
        return;
      }
      if (post.cta.state !== "open") return;
      const campaignId = post.cta.targetId ?? post.campaignId;
      if (!campaignId) return;
      router.push({ pathname: "/donate/[id]", params: { id: campaignId } });
      return;
    }

    if (post.cta.type === "apply") {
      if (post.cta.state !== "open" || !requireAuth()) return;
      router.push({ pathname: "/apply/[id]", params: { id: post.cta.targetId ?? post.id } });
      return;
    }

    if (post.cta.type === "contact") {
      if (!requireAuth()) return;
      await openPostContact(post);
    }
  };

  if (isLoading) {
    return (
      <Container className="bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <MenuPageHeader title="تفاصيل المنشور" />
        <View className="gap-2">
          <CardSkeleton height={190} margin={0} />
          <CardSkeleton height={260} margin={0} />
        </View>
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className="bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <MenuPageHeader title="تفاصيل المنشور" />
        <EmptyState title="تعذر العثور على تفاصيل المنشور" image={mainImage} />
        <View className="mt-4">
          <Button fullWidth onPress={() => router.replace("/(tabs)/home")}>العودة إلى الرئيسية</Button>
        </View>
      </Container>
    );
  }

  const title = getPostDisplayTitle(post);
  const helpOfferActionLabel = post.myOffer
    ? ({
        pending: "بانتظار موافقة المستفيد",
        accepted: "تم قبول العرض - متابعة",
        contacting: "جاري التواصل - متابعة",
        agreed: "تم الاتفاق - متابعة",
      } as const)[post.myOffer.status]
    : null;
  const terminalHelpAvailability =
    post.helpStatus === "fulfilled" ||
    post.helpStatus === "partially_fulfilled" ||
    post.helpStatus === "not_fulfilled" ||
    post.helpStatus === "expired"
      ? post.helpStatus
      : null;
  const fallbackHelpAvailability = post.myOffer
    ? "existing_offer"
    : post.hasFinalAgreement
      ? "final_agreement"
      : terminalHelpAvailability ?? (!isAuthenticated ? "login_required" : post.canOfferHelp ? "available" : "not_eligible");
  const helpAvailability = post.helpOfferAvailability ?? fallbackHelpAvailability;
  const actionLabel = isHelp
    ? helpOfferActionLabel ?? HELP_AVAILABILITY_LABELS[helpAvailability]
    : post.cta.type === "donate" && myDonation
      ? "عرض تفاصيل التبرع"
      : getPostActionLabel(post);
  const canShowAction = isHelp || ["donate", "apply", "contact"].includes(post.cta.type);
  const helpWorkflowLocked = isHelp && !post.myOffer && !["available", "login_required"].includes(helpAvailability);
  const workflowLocked = isHelp
    ? helpWorkflowLocked
    : (post.cta.type === "apply" && post.cta.state !== "open") ||
      (post.cta.type === "donate" && !myDonation && post.cta.state !== "open") ||
      (post.cta.type === "donate" && isAuthenticated && myDonationsQuery.isLoading);

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
      <MenuPageHeader title="تفاصيل المنشور" />

      <Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-start justify-between gap-3">
          <View className="flex-1 gap-2">
            <Text variant="heading" weight="bold" rtlAlign="right">{title}</Text>
            <View className="flex-row-reverse flex-wrap items-center gap-2">
              <View className="rounded-full bg-primary-400/15 px-3 py-1">
                <Text size="2xs" weight="medium" className="text-primary-400">
                  {HOME_POST_TYPE_LABELS[post.postType]}
                </Text>
              </View>
              {post.category?.name ? (
                <View className="rounded-full bg-primary-100 px-3 py-1 dark:bg-primary-400/15">
                  <Text size="2xs" weight="medium" className="text-primary-400">
                    {localizeCategoryName(post.category.name)}
                  </Text>
                </View>
              ) : null}
              {post.publisher.publisherType === "organization" && post.publisher.verified ? (
                <View className="flex-row-reverse items-center gap-1 rounded-full bg-success-100/15 px-3 py-1">
                  <ShieldCheck size={12} color="#16A34A" />
                  <Text size="2xs" weight="medium" className="text-success-100">موثق</Text>
                </View>
              ) : null}
              <View className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-350">
                <Text size="2xs" weight="medium" className="text-gray-500 dark:text-gray-300">
                  {isHelp
                    ? post.hasFinalAgreement
                      ? "تم الاتفاق"
                      : HELP_STATUS_LABELS[post.helpStatus ?? "open"]
                    : getPostActionStateLabel(post)}
                </Text>
              </View>
            </View>
          </View>
          <Avatar name={post.publisher.name} imageUrl={post.publisher.avatarUrl} size={48} />
        </View>

        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-1">
            <Text weight="semibold" size="sm">{post.publisher.name}</Text>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">@{post.publisher.username}</Text>
          </View>
          <View className="items-end gap-1">
            <View className="flex-row-reverse items-center gap-1">
              <MapPin size={14} color="#9CA3AF" />
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                {localizeSyrianLocation(post.location || post.publisher.city) || "مدينة غير محددة"}
              </Text>
            </View>
            <View className="flex-row-reverse items-center gap-1">
              <CalendarDays size={14} color="#9CA3AF" />
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                {formatHomePostRelativeDate(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        {isHelp ? (
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            عروض المساعدة النشطة: {formatWesternNumber(post.activeOffersCount ?? 0)}
          </Text>
        ) : null}
      </Card>

      <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
        <Text weight="semibold" size="sm">الوصف</Text>
        <Text size="sm" className="leading-7">{post.content}</Text>
        {post.images.length > 0 ? (
          <FeedMediaGrid images={post.images} onPress={(index) => setGalleryIndex(index)} />
        ) : null}
        {(post.videos ?? []).map((videoUrl, index) =>
          activeVideoIndex === index ? (
            <View key={`${videoUrl}-${index}`} className="overflow-hidden rounded-xl bg-dark-350">
              <VideoPlayer
                url={videoUrl}
                active
                nativeControls
                style={{ width: "100%", height: 220 }}
              />
            </View>
          ) : (
            <Pressable
              key={`${videoUrl}-${index}`}
              onPress={() => setActiveVideoIndex(index)}
              accessibilityRole="button"
              accessibilityLabel={`تشغيل فيديو المنشور ${index + 1}`}
              className="h-[220px] items-center justify-center overflow-hidden rounded-xl bg-dark-350"
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-black/60">
                <PlayIcon size={28} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text size="2xs" className="mt-3 text-light-50">تشغيل الفيديو</Text>
            </Pressable>
          ),
        )}
      </Card>

      {campaign ? (
        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">معلومات الحملة</Text>
          <Text size="xs" weight="semibold">{campaign.title}</Text>
          {campaign.goalAmount > 0 ? (
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              تم جمع {formatWesternNumber(campaign.raisedAmount)} من أصل {formatWesternNumber(campaign.goalAmount)}
            </Text>
          ) : null}
        </Card>
      ) : null}

      {canShowAction ? (
        <Button fullWidth disabled={workflowLocked} onPress={() => void handlePrimaryAction()}>
          {actionLabel}
        </Button>
      ) : null}

      <FullScreenImageGallery
        images={post.images}
        visible={galleryIndex !== null}
        initialIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
      />
    </Container>
  );
}
