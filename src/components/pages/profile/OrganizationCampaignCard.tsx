import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Check, MapPin, Tag, X } from "lucide-react-native";
import { Modal, Pressable, useWindowDimensions, View, type GestureResponderEvent } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import { FeedMediaGrid } from "@/src/components/shared/FeedMediaGrid";
import { FullScreenImageGallery } from "@/src/components/shared/FullScreenImageGallery";
import { HeartBurst, useHeartBurst } from "@/src/components/shared/HeartBurst";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { useRecommendationFeedback } from "@/src/features/personalization/queries";
import { useLikePost } from "@/src/features/posts/queries";
import type { Campaign } from "@/src/features/posts/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

const MAX_CONTENT = 180;
const ACTION_MENU_WIDTH = 208;
const ACTION_MENU_GAP = 8;
const ACTION_MENU_PADDING = 12;
const ACTION_MENU_ESTIMATED_HEIGHT = 108;

export function OrganizationCampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const likeMutation = useLikePost();
  const {
    trigger: triggerHeartBurst,
    scale: heartScale,
    opacity: heartOpacity,
    position: heartPosition,
  } = useHeartBurst();
  const feedbackMutation = useRecommendationFeedback();
  const [expanded, setExpanded] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(Boolean(campaign.isLiked));
  const [likesCount, setLikesCount] = useState(campaign.stats.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const lastCardTapRef = useRef(0);
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionsButtonRef = useRef<View>(null);
  const contentRef = useRef<View>(null);
  const [optionsAnchor, setOptionsAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const HeartIcon = appIcons.myDonations;
  const MoreIcon = appIcons.moreVertical;
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

  const handleToggleLike = async () => {
    if (!campaign.engagementPostId || !requireAuth() || likeMutation.isPending) return;
    const wasLiked = isLiked;
    const previousCount = likesCount;
    const nextLiked = !wasLiked;

    setIsLiked(nextLiked);
    setLikesCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));

    try {
      const result = await likeMutation.mutateAsync({ postId: campaign.engagementPostId, like: nextLiked });
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
    } catch {
      setIsLiked(wasLiked);
      setLikesCount(previousCount);
      toast.error("لم نتمكن من تحديث الإعجاب الآن. حاول مرة أخرى.");
    }
  };

  const handleDoubleAwarePress = (singleAction: () => void, event: GestureResponderEvent) => {
    const now = Date.now();
    if (now - lastCardTapRef.current <= 300) {
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
      lastCardTapRef.current = 0;
      const { pageX, pageY } = event.nativeEvent;
      contentRef.current?.measureInWindow((x, y) => {
        triggerHeartBurst(pageX - x, pageY - y);
      });
      void handleToggleLike();
      return;
    }

    lastCardTapRef.current = now;
    if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    singleTapTimerRef.current = setTimeout(() => {
      lastCardTapRef.current = 0;
      singleTapTimerRef.current = null;
      singleAction();
    }, 300);
  };

  const closeOptionsMenu = () => setIsOptionsOpen(false);

  const openOptionsMenu = () => {
    const anchorNode = optionsButtonRef.current;
    if (!anchorNode) {
      setIsOptionsOpen(true);
      return;
    }
    anchorNode.measureInWindow((x, y, width, height) => {
      setOptionsAnchor({ x, y, width, height });
      setIsOptionsOpen(true);
    });
  };

  const getOptionsMenuStyle = () => {
    const below = optionsAnchor.y + optionsAnchor.height + ACTION_MENU_GAP;
    const above = Math.max(
      ACTION_MENU_PADDING,
      optionsAnchor.y - ACTION_MENU_ESTIMATED_HEIGHT - ACTION_MENU_GAP,
    );
    const top = below + ACTION_MENU_ESTIMATED_HEIGHT > windowHeight ? above : below;
    const left = Math.max(
      ACTION_MENU_PADDING,
      Math.min(
        optionsAnchor.x + optionsAnchor.width - ACTION_MENU_WIDTH,
        windowWidth - ACTION_MENU_WIDTH - ACTION_MENU_PADDING,
      ),
    );
    return { top, left };
  };

  const handleRecommendationFeedback = async (action: "interested" | "not_interested") => {
    closeOptionsMenu();
    if (!requireAuth() || feedbackMutation.isPending) return;
    try {
      await feedbackMutation.mutateAsync({ contentType: "campaign", contentId: campaign.id, action });
      toast.success(
        action === "interested"
          ? "سنقترح لك حملات مشابهة أكثر."
          : "سنقلل ظهور الحملات المشابهة.",
        "تم تحديث تفضيلاتك",
      );
    } catch {
      toast.error("تعذر حفظ تفضيلك الآن. حاول مرة أخرى.");
    }
  };

  return (
    <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
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

      <View ref={contentRef} className="relative">
        <Pressable
          onPress={(event) => handleDoubleAwarePress(() => router.push(`/campaigns/${campaign.id}` as never), event)}
          accessibilityRole="button"
          accessibilityLabel={`فتح حملة ${campaign.title}. اضغط مرتين للإعجاب`}
        >
          <Text weight="semibold" size="sm" className="mt-3 text-dark-100 dark:text-light-50">
            {campaign.title}
          </Text>
          <Text size="sm" className="mt-2 leading-7 text-dark-100 dark:text-light-50">
            {displayContent}
          </Text>
          <View className="mt-2 flex-row-reverse flex-wrap gap-2">
            {categoryName ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 dark:bg-primary-400/15">
                <Tag size={12} color={primaryColor} strokeWidth={2.2} />
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
        </Pressable>

        {shouldTruncate ? (
          <Pressable onPress={() => setExpanded((value) => !value)} className="mt-1 self-end">
            <Text size="xs" weight="semibold" className="text-primary-400">
              {expanded ? "عرض أقل" : "عرض المزيد"}
            </Text>
          </Pressable>
        ) : null}

        <FeedMediaGrid
          images={campaign.images}
          onPress={(index, event) => handleDoubleAwarePress(() => setGalleryIndex(index), event)}
        />

        <HeartBurst scale={heartScale} opacity={heartOpacity} position={heartPosition} />
      </View>

      <FullScreenImageGallery
        images={campaign.images}
        visible={galleryIndex !== null}
        initialIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
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

      <View className="mt-3 flex-row-reverse items-center justify-between border-t border-gray-100 pt-2 dark:border-dark-400">
        <Pressable
          onPress={() => void handleToggleLike()}
          disabled={!campaign.engagementPostId || likeMutation.isPending}
          className="flex-row-reverse items-center gap-1.5 rounded-lg px-2 py-1.5"
          accessibilityRole="button"
          accessibilityLabel={isLiked ? "إلغاء الإعجاب بالحملة" : "إعجاب بالحملة"}
        >
          <HeartIcon
            size={18}
            color={isLiked ? "#E11D48" : "#9CA3AF"}
            fill={isLiked ? "#E11D48" : "transparent"}
            strokeWidth={2.25}
          />
          <Text size="xs" className={isLiked ? "text-rose-600" : "text-gray-500 dark:text-gray-300"}>
            {likesCount}
          </Text>
        </Pressable>

        <Pressable
          ref={optionsButtonRef}
          onPress={openOptionsMenu}
          className="h-8 w-8 items-center justify-center rounded-lg"
          accessibilityRole="button"
          accessibilityLabel="خيارات الحملة"
        >
          <MoreIcon size={18} color={isOptionsOpen ? primaryColor : "#9CA3AF"} strokeWidth={2.25} />
        </Pressable>
      </View>

      <Modal
        visible={isOptionsOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeOptionsMenu}
      >
        <View className="flex-1" onTouchStart={closeOptionsMenu}>
          <View className="absolute inset-0 bg-transparent" />
          <View
            className="absolute z-30 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-dark-400 dark:bg-dark-500"
            style={getOptionsMenuStyle()}
            onStartShouldSetResponder={() => true}
            onTouchStart={(event) => event.stopPropagation()}
          >
            <Pressable
              onPress={() => void handleRecommendationFeedback("interested")}
              disabled={feedbackMutation.isPending}
              className="flex-row-reverse items-center justify-between rounded-lg px-3 py-2"
              accessibilityRole="button"
            >
              <Text size="xs">مهتم</Text>
              <Check size={15} color={primaryColor} strokeWidth={2.5} />
            </Pressable>
            <Pressable
              onPress={() => void handleRecommendationFeedback("not_interested")}
              disabled={feedbackMutation.isPending}
              className="flex-row-reverse items-center justify-between rounded-lg px-3 py-2"
              accessibilityRole="button"
            >
              <Text size="xs" className="text-gray-600 dark:text-gray-200">غير مهتم</Text>
              <X size={15} color="#9CA3AF" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </Modal>

      <View className="mt-3">
        <Button fullWidth size="small" variant="primary" onPress={handleDetails}>
          عرض التفاصيل
        </Button>
      </View>
    </Card>
  );
}
