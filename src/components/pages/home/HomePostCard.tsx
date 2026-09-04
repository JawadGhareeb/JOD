import { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Modal,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { MapPin, Pencil, Tag, Trash2 } from "lucide-react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import { FeedMediaGrid } from "@/src/components/shared/FeedMediaGrid";
import { RecommendationFeedbackBox } from "@/src/components/shared/RecommendationFeedbackBox";
import { HomePostTypeEnum } from "@/src/constants/global";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import { useLikePost, useReportPost, useSavePost } from "@/src/features/posts/queries";
import { useReportReasons } from "@/src/features/lookups/queries";
import type { CreatePostType, HomePost } from "@/src/features/posts/types";
import { useRTL } from "@/src/providers/RTLProvider";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";
import type { ProfilePostStatus } from "@/src/types/profile";

type HomePostCardMode = "default" | "own" | "saved";

type HomePostCardProps = {
  post: HomePost;
  showCta?: boolean;
  enableAuthorNavigation?: boolean;
  mode?: HomePostCardMode;
  ownPostStatus?: ProfilePostStatus;
  onDelete?: (post: HomePost) => void;
  onUnsave?: (post: HomePost) => void;
  onEdit?: (post: HomePost) => void;
};

const MAX_CONTENT = 120;
const ACTION_MENU_WIDTH = 208;
const ACTION_MENU_GAP = 8;
const ACTION_MENU_PADDING = 12;
const ACTION_MENU_ESTIMATED_HEIGHT_SINGLE = 76;
const ACTION_MENU_ESTIMATED_HEIGHT_DOUBLE = 164;
const reportTypeOptions: SelectionOption[] = [
  {
    label: "محتوى مضلل",
    value: "misleading",
    hint: "معلومات غير صحيحة أو غير موثوقة.",
  },
  {
    label: "محتوى مسيء أو غير لائق",
    value: "abusive",
    hint: "يتضمن إساءة لفظية أو ألفاظ غير مناسبة.",
  },
  {
    label: "احتيال أو طلب تبرع مشبوه",
    value: "fraud",
    hint: "طلب دعم مالي يثير الشك أو بدون إثباتات.",
  },
  {
    label: "انتحال جهة أو شخصية",
    value: "impersonation",
    hint: "استخدام اسم جهة أو شخص بدون صلاحية.",
  },
  {
    label: "سبب آخر",
    value: "other",
    hint: "اكتب سببًا مخصصًا غير الخيارات السابقة.",
  },
];

const mapPostTypeToCreateType = (postType: HomePost["postType"]): CreatePostType => {
  if (postType === HomePostTypeEnum.DonationCampaign) return "donation";
  if (postType === HomePostTypeEnum.HelpRequest) return "help";
  if (postType === HomePostTypeEnum.ServiceOffer) return "service";
  return "volunteer";
};

export function HomePostCard({
  post,
  showCta = true,
  enableAuthorNavigation = false,
  mode = "default",
  ownPostStatus,
  onDelete,
  onUnsave,
  onEdit,
}: HomePostCardProps) {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const { isRTL } = useRTL();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  const reportMutation = useReportPost();
  const reportReasonsQuery = useReportReasons();
  const liveReportTypeOptions: SelectionOption[] = (reportReasonsQuery.data ?? []).map((reason) => ({
    label: reason.label,
    value: reason.code,
    hint: reason.hint,
  }));
  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved || post.saved || mode === "saved"));
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOtherReasonDialogOpen, setIsOtherReasonDialogOpen] = useState(false);


  const [otherReportReason, setOtherReportReason] = useState("");
  const optionsButtonRef = useRef<View>(null);
  const [optionsAnchor, setOptionsAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [pendingOwnPostAction, setPendingOwnPostAction] = useState<"delete" | "edit" | null>(null);
  const shouldTruncate = post.content.length > MAX_CONTENT;
  const displayContent = useMemo(() => {
    if (expanded || !shouldTruncate) return post.content;
    return `${post.content.slice(0, MAX_CONTENT).trim()}...`;
  }, [expanded, shouldTruncate, post.content]);

  const BookmarkIcon = appIcons.savedPosts;
  const HeartIcon = appIcons.myDonations;
  const MoreIcon = appIcons.moreVertical;
  const ShieldIcon = appIcons.shield;

  const canOpenAuthorProfile = enableAuthorNavigation && Boolean(post.publisher.id);
  const isOwnPost = mode === "own";
  const isSavedPostList = mode === "saved";
  const canEditRejectedPost = isOwnPost && ownPostStatus === "unposted";
  const actionItemClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const estimatedOptionsMenuHeight =
    isOwnPost && canEditRejectedPost
      ? ACTION_MENU_ESTIMATED_HEIGHT_DOUBLE
      : ACTION_MENU_ESTIMATED_HEIGHT_SINGLE;
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

  const closeOptionsMenu = () => {
    setIsOptionsOpen(false);
  };

  const getOptionsMenuStyle = () => {
    const desiredTop = optionsAnchor.y + optionsAnchor.height + ACTION_MENU_GAP;
    const maxTop = Math.max(ACTION_MENU_PADDING, desiredTop);
    const fallbackTop = Math.max(
      ACTION_MENU_PADDING,
      optionsAnchor.y - estimatedOptionsMenuHeight - ACTION_MENU_GAP,
    );
    const top = maxTop + estimatedOptionsMenuHeight > windowHeight ? fallbackTop : maxTop;

    const left = Math.max(
      ACTION_MENU_PADDING,
      Math.min(
        isRTL ? optionsAnchor.x + optionsAnchor.width - ACTION_MENU_WIDTH : optionsAnchor.x,
        windowWidth - ACTION_MENU_WIDTH - ACTION_MENU_PADDING,
      ),
    );

    return {
      top,
      left,
    };
  };

  const handleOpenDetails = () => {
    closeOptionsMenu();
    router.push({
      pathname: "/posts/[id]",
      params: { id: post.id },
    });
  };

  const handleOpenAuthorProfile = () => {
    if (!canOpenAuthorProfile) return;
    if (!requireAuth()) return;
    router.push({
      pathname: "/author/[id]",
      params: { id: post.publisher.id },
    });
  };

  const handleToggleLike = async () => {
    if (!requireAuth()) return;
    const wasLiked = isLiked;
    const previousCount = likesCount;
    const nextLiked = !wasLiked;

    setIsLiked(nextLiked);
    setLikesCount((current) => current + (nextLiked ? 1 : -1));

    try {
      const result = await likeMutation.mutateAsync({ postId: post.id, like: nextLiked });
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
    } catch {
      setIsLiked(wasLiked);
      setLikesCount(previousCount);
      toast.error("لم نتمكن من تحديث الإعجاب الآن. حاول مرة أخرى.");
    }
  };

  const handleTogglePostSaved = async () => {
    if (!requireAuth()) return;
    const wasSaved = isSaved;
    const willSave = !wasSaved;

    setIsSaved(willSave);
    closeOptionsMenu();

    try {
      const result = await saveMutation.mutateAsync({ postId: post.id, save: willSave });
      setIsSaved(result.isSaved);
      toast.success(
        result.isSaved
          ? "يمكنك العثور عليه لاحقًا في المنشورات المحفوظة."
          : "تمت إزالة المنشور من المحفوظات.",
        result.isSaved ? "تم حفظ المنشور" : "تم إزالة الحفظ",
      );
    } catch {
      setIsSaved(wasSaved);
      toast.error("لم نتمكن من تحديث الحفظ الآن. حاول مرة أخرى.");
    }
  };

  const handleUnsavePost = async () => {
    if (!requireAuth()) return;
    closeOptionsMenu();

    try {
      await saveMutation.mutateAsync({ postId: post.id, save: false });
      setIsSaved(false);
      onUnsave?.(post);
      toast.success("تمت إزالة المنشور من صفحة المنشورات المحفوظة.", "تم إلغاء الحفظ");
    } catch {
      toast.error("لم نتمكن من إزالة الحفظ الآن. حاول مرة أخرى.", "تعذر إلغاء الحفظ");
    }
  };

  const handleDeleteOwnPost = () => {
    closeOptionsMenu();
    setPendingOwnPostAction("delete");
  };

  const executeEditOwnPost = () => {
    if (onEdit) {
      onEdit(post);
      return;
    }

    router.push({
      pathname: "/create-post",
      params: {
        mode: "edit",
        postId: post.id,
        postType: mapPostTypeToCreateType(post.postType),
        title: post.title || "",
        details: post.content,
        city: post.publisher.city || "",
        images: post.images.join("|"),
      },
    });
  };

  const handleEditOwnPost = () => {
    closeOptionsMenu();
    setPendingOwnPostAction("edit");
  };

  const handleConfirmOwnPostAction = () => {
    const action = pendingOwnPostAction;
    setPendingOwnPostAction(null);

    if (action === "delete") {
      onDelete?.(post);
      return;
    }

    if (action === "edit") {
      executeEditOwnPost();
    }
  };

  const handleReportPost = () => {
    closeOptionsMenu();
    if (!requireAuth()) return;
    setIsReportModalOpen(true);
  };

  const handleSelectReportType = async (reportTypeValue: string) => {
    if (reportTypeValue === "other") {
      setIsReportModalOpen(false);
      setIsOtherReasonDialogOpen(true);
      return;
    }

    try {
      await reportMutation.mutateAsync({ postId: post.id, reason: reportTypeValue });
    } catch {
      toast.error("لم نتمكن من إرسال البلاغ الآن. حاول مرة أخرى.", "تعذر إرسال البلاغ");
      return;
    }

    setIsReportModalOpen(false);
    toast.success("شكراً لك. سنقوم بمراجعة البلاغ قريبًا.", "تم إرسال البلاغ");
  };

  const handleSubmitOtherReason = async () => {
    const details = otherReportReason.trim();
    if (details.length < 3) return;

    try {
      await reportMutation.mutateAsync({ postId: post.id, reason: "other", details });
      setIsOtherReasonDialogOpen(false);
      setOtherReportReason("");
      toast.success("شكراً لك. سنقوم بمراجعة البلاغ قريبًا.", "تم إرسال البلاغ");
    } catch {
      toast.error("لم نتمكن من إرسال البلاغ الآن. حاول مرة أخرى.", "تعذر إرسال البلاغ");
    }
  };

  return (
    <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="mb-3 flex-row-reverse items-center justify-between">
        <Pressable
          onPress={handleOpenAuthorProfile}
          disabled={!canOpenAuthorProfile}
          className="flex-row-reverse items-center gap-2"
          accessibilityRole={canOpenAuthorProfile ? "button" : undefined}
          accessibilityLabel={
            canOpenAuthorProfile ? `عرض الملف الشخصي للناشر ${post.publisher.name}` : undefined
          }
        >
          <Avatar name={post.publisher.name} imageUrl={post.publisher.avatarUrl} size={42} />
          <View>
            <View className="flex-row-reverse items-center gap-1">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                {post.publisher.name}
              </Text>
              {post.publisher.verified ? <VerifiedBadge /> : null}
            </View>
            <View className="flex-row-reverse items-center gap-1">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                @{post.publisher.username} • {formatHomePostRelativeDate(post.createdAt)}
              </Text>
              {post.location ? (
                <View className="flex-row-reverse items-center gap-0.5">
                  <Text size="2xs" className="text-gray-400 dark:text-gray-400">•</Text>
                  <MapPin size={11} color="#9CA3AF" strokeWidth={2.25} />
                  <Text size="2xs" className="text-gray-500 dark:text-gray-300">{post.location}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
        <View className="rounded-full bg-primary-400/15 px-3 py-1">
          <Text size="2xs" weight="medium" className="text-primary-400">
            {HOME_POST_TYPE_LABELS[post.postType]}
          </Text>
        </View>
      </View>

      <Text size="sm" className="text-dark-100 dark:text-light-50">
        {displayContent}
      </Text>

      {shouldTruncate ? (
        <Pressable onPress={() => setExpanded((prev) => !prev)} className="mt-2 self-end">
          <Text size="xs" weight="medium" className="text-primary-400">
            {expanded ? "عرض أقل" : "عرض المزيد"}
          </Text>
        </Pressable>
      ) : null}

      {post.category?.name ? (
        <View className="mt-2 flex-row-reverse flex-wrap items-center gap-2">
          <View className="flex-row-reverse items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 dark:bg-primary-400/15">
            <Tag size={12} color={primaryColor} strokeWidth={2.2} />
            <Text size="2xs" className="text-primary-400">{post.category.name}</Text>
          </View>
        </View>
      ) : null}

      <FeedMediaGrid
        images={post.images}
        onPress={() => router.push({ pathname: "/posts/[id]", params: { id: post.id } })}
      />

      <RecommendationFeedbackBox contentType="post" contentId={post.id} visible={Boolean(post.recommendation?.feedbackRequested)} />

      <View className="mt-3 flex-row-reverse items-center justify-between border-t border-gray-100 pt-2 dark:border-dark-400">
        <View className={`${actionItemClassName} items-center gap-2`}>
          <Pressable
            onPress={() => void handleToggleLike()}
            className={`${actionItemClassName} items-center gap-1.5 rounded-lg px-2 py-1.5`}
            accessibilityRole="button"
            accessibilityLabel={isLiked ? "إلغاء الإعجاب" : "إعجاب بالمنشور"}
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

          {!isOwnPost ? (
            <Pressable
              onPress={() => void (isSavedPostList ? handleUnsavePost() : handleTogglePostSaved())}
              className={`${actionItemClassName} items-center gap-1.5 rounded-lg px-2 py-1.5`}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? "إلغاء حفظ المنشور" : "حفظ المنشور"}
            >
              <BookmarkIcon
                size={17}
                color={isSaved ? primaryColor : "#9CA3AF"}
                fill={isSaved ? primaryColor : "transparent"}
                strokeWidth={2.25}
              />
              <Text size="xs" className={isSaved ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}>
                {isSaved ? "محفوظ" : "حفظ"}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View className="relative">
          <Pressable
            ref={optionsButtonRef}
            onPress={() => {
              if (isOptionsOpen) {
                closeOptionsMenu();
                return;
              }

              openOptionsMenu();
            }}
            className="h-8 w-8 items-center justify-center rounded-lg"
            accessibilityRole="button"
            accessibilityLabel="خيارات المنشور"
          >
            <MoreIcon
              size={18}
              color={isOptionsOpen ? primaryColor : "#9CA3AF"}
              strokeWidth={2.25}
            />
          </Pressable>

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
                {isOwnPost ? (
                  <>
                    {canEditRejectedPost ? (
                      <Pressable
                        onPress={handleEditOwnPost}
                        className={`${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                        accessibilityRole="button"
                        accessibilityLabel="تعديل المنشور المرفوض"
                      >
                        <Text size="xs" className="text-dark-100 dark:text-light-50">تعديل المنشور</Text>
                        <Pencil size={15} color={primaryColor} strokeWidth={2.25} />
                      </Pressable>
                    ) : null}

                    <Pressable
                      onPress={handleDeleteOwnPost}
                      className={`${canEditRejectedPost ? "mt-1 " : ""}${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                      accessibilityRole="button"
                      accessibilityLabel="حذف المنشور"
                    >
                      <Text size="xs" className="text-error-300">حذف المنشور</Text>
                      <Trash2 size={15} color="#DC2626" strokeWidth={2.25} />
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    onPress={handleReportPost}
                    className={`${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                    accessibilityRole="button"
                    accessibilityLabel="إبلاغ عن المنشور"
                  >
                    <Text size="xs" className="text-error-300">إبلاغ عن المنشور</Text>
                    <ShieldIcon size={15} color="#DC2626" strokeWidth={2.25} />
                  </Pressable>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </View>

      {showCta ? (
        <View className="mt-3">
          <Button fullWidth size="small" variant="primary" onPress={handleOpenDetails}>
            عرض التفاصيل
          </Button>
        </View>
      ) : null}

      <Dialog
        visible={pendingOwnPostAction !== null}
        title={
          pendingOwnPostAction === "delete" ? "حذف المنشور" : "تأكيد التعديلات"
        }
        titleColor={pendingOwnPostAction === "delete" ? "error" : undefined}
        message={
          pendingOwnPostAction === "delete"
            ? "هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذه العملية."
            : "هل تريد فتح صفحة التعديل ومراجعة التغييرات قبل إعادة إرسال المنشور؟"
        }
        icon={
          pendingOwnPostAction === "delete" ? (
            <Trash2 size={28} color="#DC2626" strokeWidth={2.25} />
          ) : (
            <Pencil size={28} color={primaryColor} strokeWidth={2.25} />
          )
        }
        onClose={() => setPendingOwnPostAction(null)}
        buttons={[
          {
            text: "تراجع",
            variant: "tertiary",
            onPress: () => setPendingOwnPostAction(null),
          },
          {
            text:
              pendingOwnPostAction === "delete" ? "حذف المنشور" : "متابعة التعديل",
            variant: "primary",
            className: pendingOwnPostAction === "delete" ? "bg-error-300 shadow-error-300/30" : undefined,
            onPress: handleConfirmOwnPostAction,
          },
        ]}
      />

      <SelectionModal
        visible={isReportModalOpen}
        title="إبلاغ عن المنشور"
        description="اختر نوع البلاغ لمساعدة فريق الإشراف على المعالجة بشكل أسرع:"
        options={liveReportTypeOptions.length ? liveReportTypeOptions : reportTypeOptions}
        onSelect={handleSelectReportType}
        onClose={() => setIsReportModalOpen(false)}
      />

      <Dialog
        visible={isOtherReasonDialogOpen}
        title="سبب آخر للبلاغ"
        onClose={() => {
          setIsOtherReasonDialogOpen(false);
          setOtherReportReason("");
        }}
        showCloseButton
      >
        <Text size="xs" className="mb-3 leading-6 text-gray-500 dark:text-gray-300">
          اكتب السبب الذي تريد الإبلاغ عنه، وسيتم مراجعته من فريق الإشراف.
        </Text>
        <Input
          fullWidth
          multiline
          showStatusIcon={false}
          value={otherReportReason}
          onChangeText={setOtherReportReason}
          placeholder="اكتب سبب البلاغ هنا..."
          inputClassName="min-h-[64px] text-xs"
          inputContainerClassName="min-h-[88px] py-2"
          maxLength={180}
        />
        <Text size="2xs" className="mt-2 self-start text-gray-400 dark:text-gray-300">
          {otherReportReason.trim().length}/180
        </Text>
        <View className="mt-4">
          <Button
            fullWidth
            size="small"
            disabled={otherReportReason.trim().length < 3 || reportMutation.isPending}
            loading={reportMutation.isPending}
            onPress={() => void handleSubmitOtherReason()}
          >
            إرسال البلاغ
          </Button>
        </View>
      </Dialog>

    </Card>
  );
}
