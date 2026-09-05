import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Volume2, VolumeX, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Modal, Pressable, Share, useWindowDimensions, View } from "react-native";
import { useRouter } from "expo-router";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import { FollowButton } from "@/src/components/shared/FollowButton";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import { VideoPlayer } from "@/src/components/shared/VideoPlayer";
import Dialog from "@/src/components/ui/Dialog";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { useReportReasons } from "@/src/features/lookups/queries";
import type { ReportReasonCode } from "@/src/features/lookups/types";
import { getReelPlaybackUrl } from "@/src/features/media/helpers";
import { useLikeMedia, useReportMedia, useSaveMedia } from "@/src/features/media/queries";
import type { PublicMediaItem } from "@/src/features/media/types";
import { useRecommendationFeedback } from "@/src/features/personalization/queries";
import { usePublisher } from "@/src/features/posts/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

const ACTION_MENU_WIDTH = 228;
const ACTION_MENU_HEIGHT = 164;
const ACTION_MENU_GAP = 8;
const ACTION_MENU_PADDING = 12;

export function ReelVideoItem({
  video,
  active,
  height,
  onPlayRequest,
}: {
  video: PublicMediaItem;
  active: boolean;
  height: number;
  onPlayRequest: () => void;
}) {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const HeartIcon = appIcons.myDonations;
  const BookmarkIcon = appIcons.savedPosts;
  const ShareIcon = appIcons.shares;
  const MoreIcon = appIcons.moreVertical;
  const ShieldIcon = appIcons.shield;
  const PlayIcon = appIcons.play;
  const likeMutation = useLikeMedia();
  const saveMutation = useSaveMedia();
  const reportMutation = useReportMedia();
  const feedbackMutation = useRecommendationFeedback();
  const publisherQuery = usePublisher(video.organization?.id);
  const reportReasons = useReportReasons();
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [likesCount, setLikesCount] = useState(video.likesCount ?? 0);
  const [isSaved, setIsSaved] = useState(video.isSaved);
  const [savesCount, setSavesCount] = useState(video.savesCount ?? 0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [reportPickerOpen, setReportPickerOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReasonCode | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [customReportOpen, setCustomReportOpen] = useState(false);
  const optionsButtonRef = useRef<View>(null);
  const [optionsAnchor, setOptionsAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    setIsLiked(video.isLiked);
    setLikesCount(video.likesCount ?? 0);
    setIsSaved(video.isSaved);
    setSavesCount(video.savesCount ?? 0);
  }, [video.isLiked, video.isSaved, video.likesCount, video.savesCount]);

  const reportOptions = useMemo<SelectionOption[]>(
    () =>
      (reportReasons.data ?? []).map((reason) => ({
        label: reason.label,
        value: reason.code,
        hint: reason.hint,
      })),
    [reportReasons.data],
  );

  const closeOptionsMenu = () => setIsOptionsOpen(false);

  const openOptionsMenu = () => {
    const anchorNode = optionsButtonRef.current;
    if (!anchorNode) {
      setIsOptionsOpen(true);
      return;
    }
    anchorNode.measureInWindow((x, y, width, anchorHeight) => {
      setOptionsAnchor({ x, y, width, height: anchorHeight });
      setIsOptionsOpen(true);
    });
  };

  const getOptionsMenuStyle = () => {
    const below = optionsAnchor.y + optionsAnchor.height + ACTION_MENU_GAP;
    const above = Math.max(ACTION_MENU_PADDING, optionsAnchor.y - ACTION_MENU_HEIGHT - ACTION_MENU_GAP);
    const top = below + ACTION_MENU_HEIGHT > windowHeight ? above : below;
    const left = Math.max(
      ACTION_MENU_PADDING,
      Math.min(
        optionsAnchor.x + optionsAnchor.width - ACTION_MENU_WIDTH,
        windowWidth - ACTION_MENU_WIDTH - ACTION_MENU_PADDING,
      ),
    );
    return { top, left };
  };

  const toggleLike = async () => {
    if (!requireAuth() || likeMutation.isPending) return;
    const wasLiked = isLiked;
    const previousCount = likesCount;
    const next = !wasLiked;
    setIsLiked(next);
    setLikesCount((current) => Math.max(0, current + (next ? 1 : -1)));
    try {
      const result = await likeMutation.mutateAsync({ mediaId: video.id, like: next });
      setIsLiked(Boolean(result.isLiked));
      setLikesCount(result.likesCount ?? previousCount);
    } catch {
      setIsLiked(wasLiked);
      setLikesCount(previousCount);
      toast.error("تعذر تحديث الإعجاب. حاول مرة أخرى.", "حدث خطأ");
    }
  };

  const toggleSave = async () => {
    if (!requireAuth() || saveMutation.isPending) return;
    const wasSaved = isSaved;
    const previousCount = savesCount;
    const next = !wasSaved;
    setIsSaved(next);
    setSavesCount((current) => Math.max(0, current + (next ? 1 : -1)));
    try {
      const result = await saveMutation.mutateAsync({ mediaId: video.id, save: next });
      setIsSaved(Boolean(result.isSaved));
      setSavesCount(result.savesCount ?? previousCount);
    } catch {
      setIsSaved(wasSaved);
      setSavesCount(previousCount);
      toast.error("تعذر تحديث الحفظ. حاول مرة أخرى.", "حدث خطأ");
    }
  };

  const shareReel = async () => {
    try {
      await Share.share({ message: playbackUrl });
    } catch {
      toast.error("تعذر فتح المشاركة الآن.");
    }
  };

  const handleRecommendationFeedback = async (action: "interested" | "not_interested") => {
    closeOptionsMenu();
    if (!requireAuth() || feedbackMutation.isPending) return;
    try {
      await feedbackMutation.mutateAsync({ contentType: "media", contentId: video.id, action });
      toast.success(
        action === "interested"
          ? "سنقترح لك ريلز مشابهة أكثر."
          : "سنقلل ظهور الريلز المشابهة.",
        "تم تحديث تفضيلاتك",
      );
    } catch {
      toast.error("تعذر حفظ تفضيلك الآن. حاول مرة أخرى.");
    }
  };

  const chooseReportReason = (value: string) => {
    const reason = value as ReportReasonCode;
    setReportPickerOpen(false);
    if (reason === "other") {
      setSelectedReason(reason);
      setCustomReportOpen(true);
      return;
    }
    void submitReport(reason);
  };

  const submitReport = async (reason: ReportReasonCode, details?: string) => {
    if (!requireAuth() || reportMutation.isPending) return;
    try {
      await reportMutation.mutateAsync({ mediaId: video.id, reason, details });
      setCustomReportOpen(false);
      setCustomReason("");
      setSelectedReason(null);
      toast.success("تم إرسال البلاغ للمراجعة.", "تم استلام البلاغ");
    } catch {
      toast.error("تعذر إرسال البلاغ. حاول مرة أخرى.", "حدث خطأ");
    }
  };

  const publisher = publisherQuery.data;
  const organizationName = publisher?.name || video.organization?.name || "منظمة على جود";
  const organizationImage = publisher?.avatarUrl || video.organization?.image || video.organization?.logo?.url || null;
  const organizationVerified = Boolean(publisher?.verified ?? video.organization?.verified);
  const playbackUrl = getReelPlaybackUrl(video);

  return (
    <View style={{ height }}>
      <View className="relative flex-1 overflow-hidden bg-dark-500">
        {active ? (
          <VideoPlayer
            url={playbackUrl}
            active
            loop
            muted={isMuted}
            showProgressControls
            progressControlsPlacement="center"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Pressable
            onPress={onPlayRequest}
            className="flex-1 items-center justify-center bg-dark-500"
            accessibilityRole="button"
            accessibilityLabel="تشغيل الريل"
          >
            <View className="h-16 w-16 items-center justify-center rounded-full bg-black/55">
              <PlayIcon size={28} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </Pressable>
        )}

        <View className="absolute bottom-24 right-3 z-20 items-center gap-4">
          <Pressable
            onPress={() => void toggleLike()}
            disabled={likeMutation.isPending}
            className="items-center gap-1"
            accessibilityRole="button"
            accessibilityLabel={isLiked ? "إلغاء الإعجاب بالريل" : "إعجاب بالريل"}
          >
            <View className="h-11 w-11 items-center justify-center">
              <HeartIcon
                size={24}
                color={isLiked ? "#E11D48" : "#FFFFFF"}
                fill={isLiked ? "#E11D48" : "transparent"}
                strokeWidth={2.25}
              />
            </View>
            <Text size="2xs" weight="semibold" className="text-white">{likesCount}</Text>
          </Pressable>

          <Pressable
            onPress={() => void toggleSave()}
            disabled={saveMutation.isPending}
            className="items-center gap-1"
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "إلغاء حفظ الريل" : "حفظ الريل"}
          >
            <View className="h-11 w-11 items-center justify-center">
              <BookmarkIcon
                size={23}
                color={isSaved ? primaryColor : "#FFFFFF"}
                fill={isSaved ? primaryColor : "transparent"}
                strokeWidth={2.25}
              />
            </View>
            <Text size="2xs" weight="semibold" className="text-white">{savesCount}</Text>
          </Pressable>

          <Pressable
            onPress={() => void shareReel()}
            className="items-center gap-1"
            accessibilityRole="button"
            accessibilityLabel="مشاركة الريل"
          >
            <View className="h-11 w-11 items-center justify-center">
              <ShareIcon size={23} color="#FFFFFF" strokeWidth={2.25} />
            </View>
            <Text size="2xs" weight="semibold" className="text-white">مشاركة</Text>
          </Pressable>

          <Pressable
            ref={optionsButtonRef}
            onPress={openOptionsMenu}
            className="items-center gap-1"
            accessibilityRole="button"
            accessibilityLabel="خيارات الريل"
          >
            <View className="h-11 w-11 items-center justify-center">
              <MoreIcon size={23} color="#FFFFFF" strokeWidth={2.25} />
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setIsMuted((current) => !current)}
          className="absolute bottom-2 right-3 z-30 h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={isMuted ? "تشغيل صوت الريل" : "كتم صوت الريل"}
        >
          {isMuted ? (
            <VolumeX size={23} color="#FFFFFF" strokeWidth={2.25} />
          ) : (
            <Volume2 size={23} color="#FFFFFF" strokeWidth={2.25} />
          )}
        </Pressable>

        <View className="absolute bottom-8 left-3 right-20 z-20">
          <View className="flex-row-reverse items-center gap-2">
            <Pressable
              onPress={() => {
                if (!video.organization?.id) return;
                router.push({ pathname: "/author/[id]", params: { id: video.organization.id } });
              }}
              disabled={!video.organization?.id}
              className="min-w-0 flex-1 flex-row-reverse items-center gap-2"
              accessibilityRole="button"
              accessibilityLabel={`عرض ملف ${organizationName}`}
            >
              <Avatar name={organizationName} imageUrl={organizationImage} size={38} />
              <View className="min-w-0 flex-1 items-end">
                <View className="flex-row-reverse items-center gap-1">
                  <Text weight="semibold" size="sm" className="text-white" numberOfLines={1}>
                    {organizationName}
                  </Text>
                  {organizationVerified ? <VerifiedBadge size={15} /> : null}
                </View>
                <Text size="2xs" className="mt-0.5 text-gray-200">فيديو من جود</Text>
              </View>
            </Pressable>
            {video.organization?.id && publisher ? (
              <FollowButton
                targetType="organization"
                targetId={video.organization.id}
                isFollowing={Boolean(publisher.isFollowing)}
                appearance="overlay"
              />
            ) : null}
          </View>
          {video.description ? (
            <Text size="xs" className="mt-2 text-white" numberOfLines={2} rtlAlign="right">
              {video.description}
            </Text>
          ) : null}
        </View>
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
            className="absolute z-30 w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-dark-400 dark:bg-dark-500"
            style={getOptionsMenuStyle()}
            onStartShouldSetResponder={() => true}
            onTouchStart={(event) => event.stopPropagation()}
          >
            <Pressable
              onPress={() => void handleRecommendationFeedback("interested")}
              disabled={feedbackMutation.isPending}
              className="flex-row-reverse items-center justify-between rounded-lg px-3 py-2.5"
              accessibilityRole="button"
            >
              <Text size="xs">مهتم</Text>
              <Check size={17} color={primaryColor} strokeWidth={2.5} />
            </Pressable>
            <Pressable
              onPress={() => void handleRecommendationFeedback("not_interested")}
              disabled={feedbackMutation.isPending}
              className="flex-row-reverse items-center justify-between rounded-lg px-3 py-2.5"
              accessibilityRole="button"
            >
              <Text size="xs" className="text-gray-600 dark:text-gray-200">غير مهتم</Text>
              <X size={17} color="#9CA3AF" strokeWidth={2.5} />
            </Pressable>
            <View className="my-1 h-px bg-gray-100 dark:bg-dark-400" />
            <Pressable
              onPress={() => {
                closeOptionsMenu();
                if (!requireAuth()) return;
                setReportPickerOpen(true);
              }}
              className="flex-row-reverse items-center justify-between rounded-lg px-3 py-2.5"
              accessibilityRole="button"
            >
              <Text size="xs" className="text-error-300">إبلاغ عن الريل</Text>
              <ShieldIcon size={17} color="#DC2626" strokeWidth={2.25} />
            </Pressable>
          </View>
        </View>
      </Modal>

      <SelectionModal
        visible={reportPickerOpen}
        onClose={() => setReportPickerOpen(false)}
        title="سبب الإبلاغ"
        options={reportOptions}
        selectedValue={selectedReason ?? undefined}
        onSelect={chooseReportReason}
      />

      <Dialog
        visible={customReportOpen}
        title="سبب آخر"
        cancelable={!reportMutation.isPending}
        onClose={() => !reportMutation.isPending && setCustomReportOpen(false)}
        buttons={[
          { text: "إلغاء", variant: "outline", onPress: () => setCustomReportOpen(false) },
          {
            text: "إرسال البلاغ",
            loading: reportMutation.isPending,
            onPress: () => {
              const details = customReason.trim();
              if (details.length < 3) {
                toast.error("اكتب سبباً من 3 أحرف على الأقل.");
                return;
              }
              void submitReport("other", details);
            },
          },
        ]}
      >
        <View className="gap-3">
          <Text size="xs" className="text-center text-gray-500 dark:text-gray-300">اكتب باختصار سبب الإبلاغ عن هذا الريل.</Text>
          <Input value={customReason} onChangeText={setCustomReason} placeholder="اكتب سبب الإبلاغ..." multiline />
        </View>
      </Dialog>
    </View>
  );
}
