import { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  Share,
  useWindowDimensions,
  View,
} from "react-native";
import { Archive, Pencil, Trash2 } from "lucide-react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { HomePostTypeEnum } from "@/src/constants/global";
import {
  buildHomePostShareLink,
  buildHomePostShareMessage,
  HOME_POST_TYPE_LABELS,
  formatHomePostRelativeDate,
} from "@/src/helpers/home";
import { openPostContact } from "@/src/lib/engagement";
import { useRTL } from "@/src/providers/RTLProvider";
import type { HomePost } from "@/src/types/home";
import type { CreatePostType } from "@/src/types/menu";
import type { ProfilePostStatus } from "@/src/types/profile";

type HomePostCardMode = "default" | "own" | "saved";

type HomePostCardProps = {
  post: HomePost;
  showCta?: boolean;
  enableAuthorNavigation?: boolean;
  mode?: HomePostCardMode;
  ownPostStatus?: ProfilePostStatus;
  onArchive?: (post: HomePost) => void;
  onDelete?: (post: HomePost) => void;
  onUnsave?: (post: HomePost) => void;
  onEdit?: (post: HomePost) => void;
};

const MAX_CONTENT = 120;
const ACTION_MENU_WIDTH = 208;
const ACTION_MENU_GAP = 8;
const ACTION_MENU_PADDING = 12;
const ACTION_MENU_ESTIMATED_HEIGHT_DEFAULT = 122;
const ACTION_MENU_ESTIMATED_HEIGHT_OWN = 164;
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
  return "volunteer";
};

export function HomePostCard({
  post,
  showCta = true,
  enableAuthorNavigation = false,
  mode = "default",
  ownPostStatus,
  onArchive,
  onDelete,
  onUnsave,
  onEdit,
}: HomePostCardProps) {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { isRTL } = useRTL();
  const [expanded, setExpanded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaved, setIsSaved] = useState(Boolean(post.saved || mode === "saved"));
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOtherReasonDialogOpen, setIsOtherReasonDialogOpen] = useState(false);
  const [isReportSuccessOpen, setIsReportSuccessOpen] = useState(false);
  const [lastReportType, setLastReportType] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");
  const optionsButtonRef = useRef<View>(null);
  const [optionsAnchor, setOptionsAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [pendingOwnPostAction, setPendingOwnPostAction] = useState<
    "archive" | "delete" | "edit" | null
  >(null);
  const shouldTruncate = post.content.length > MAX_CONTENT;
  const displayContent = useMemo(() => {
    if (expanded || !shouldTruncate) return post.content;
    return `${post.content.slice(0, MAX_CONTENT).trim()}...`;
  }, [expanded, shouldTruncate, post.content]);
  const previewImages = useMemo(() => post.images.slice(0, 4), [post.images]);

  const BookmarkIcon = appIcons.savedPosts;
  const HeartIcon = appIcons.myDonations;
  const SharesIcon = appIcons.shares;
  const MoreIcon = appIcons.moreVertical;
  const ShieldIcon = appIcons.shield;
  const canOpenAuthorProfile = enableAuthorNavigation && Boolean(post.publisher.id);
  const hasCta = post.cta.type !== "none";
  const isSubmitted = post.cta.state === "submitted";
  const isClosed = post.cta.state === "closed";
  const ctaLabel = isSubmitted ? "تم التقديم" : post.cta.label;
  const ctaVariant =
    post.cta.type === "apply" || post.cta.type === "donate" ? "primary" : "secondary";
  const isOwnPost = mode === "own";
  const isSavedPostList = mode === "saved";
  const canArchiveOwnPost = isOwnPost && ownPostStatus !== "archived";
  const canEditRejectedPost = isOwnPost && ownPostStatus === "unposted";
  const actionRowClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const actionItemClassName = isRTL ? "flex-row-reverse" : "flex-row";
  const estimatedOptionsMenuHeight = isOwnPost
    ? ACTION_MENU_ESTIMATED_HEIGHT_OWN
    : ACTION_MENU_ESTIMATED_HEIGHT_DEFAULT;
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

  const handlePrimaryAction = async () => {
    if (isSubmitted || isClosed) {
      return;
    }

    closeOptionsMenu();

    if (post.cta.type === "donate") {
      router.push({
        pathname: "/donate/[id]",
        params: { id: post.id },
      });
      return;
    }

    if (post.cta.type === "apply") {
      router.push({
        pathname: "/apply/[id]",
        params: { id: post.id },
      });
      return;
    }

    if (post.cta.type === "details") {
      router.push({
        pathname: "/posts/[id]",
        params: { id: post.id },
      });
      return;
    }

    if (post.cta.type === "contact") {
      await openPostContact(post);
    }
  };

  const handleOpenAuthorProfile = () => {
    if (!canOpenAuthorProfile) return;
    router.push({
      pathname: "/author/[id]",
      params: { id: post.publisher.id },
    });
  };

  const handleSharePost = async () => {
    if (isSharing) return;

    try {
      closeOptionsMenu();
      setIsSharing(true);
      const postLink = buildHomePostShareLink(post.id);
      const message = buildHomePostShareMessage(post);

      await Share.share(
        {
          title: "مشاركة منشور",
          message,
          url: postLink,
        },
        {
          subject: `منشور من ${post.publisher.name} على جود`,
        },
      );
    } catch {
      Alert.alert("تعذر المشاركة", "حدث خطأ أثناء مشاركة الرابط. حاول مرة أخرى.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleToggleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikesCount((current) => current + (next ? 1 : -1));
      return next;
    });
  };

  const handleTogglePostSaved = () => {
    const willSave = !isSaved;
    setIsSaved(willSave);
    closeOptionsMenu();
    Alert.alert(
      willSave ? "تم حفظ المنشور" : "تم إزالة الحفظ",
      willSave ? "يمكنك العثور عليه لاحقًا في المنشورات المحفوظة." : "تمت إزالة المنشور من المحفوظات.",
    );
  };

  const handleUnsavePost = () => {
    closeOptionsMenu();
    setIsSaved(false);
    onUnsave?.(post);
    Alert.alert("تم إلغاء الحفظ", "تمت إزالة المنشور من صفحة المنشورات المحفوظة.");
  };

  const handleArchiveOwnPost = () => {
    closeOptionsMenu();
    setPendingOwnPostAction("archive");
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
      pathname: "/(tabs)/create-post",
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

    if (action === "archive") {
      onArchive?.(post);
      return;
    }

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
    setIsReportModalOpen(true);
  };

  const handleSelectReportType = (reportTypeValue: string) => {
    if (reportTypeValue === "other") {
      setIsReportModalOpen(false);
      setIsOtherReasonDialogOpen(true);
      return;
    }

    const reportTypeLabel =
      reportTypeOptions.find((item) => item.value === reportTypeValue)?.label || "";
    setLastReportType(reportTypeLabel);
    setIsReportModalOpen(false);
    setIsReportSuccessOpen(true);
  };

  const handleSubmitOtherReason = () => {
    const reason = otherReportReason.trim();
    if (reason.length < 3) return;

    setLastReportType(`سبب آخر: ${reason}`);
    setIsOtherReasonDialogOpen(false);
    setOtherReportReason("");
    setIsReportSuccessOpen(true);
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
          <Avatar name={post.publisher.name} size={42} />
          <View>
            <View className="flex-row-reverse items-center gap-1">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                {post.publisher.name}
              </Text>
              {post.publisher.verified ? (
                <Text size="2xs" className="text-primary-400">
                  موثق
                </Text>
              ) : null}
            </View>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              @{post.publisher.username} • {formatHomePostRelativeDate(post.createdAt)}
            </Text>
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

      {previewImages.length > 0 ? (
        <View className="mt-3 flex-row-reverse flex-wrap justify-between gap-y-2">
          {previewImages.map((imageUri, index) => (
            <View
              key={`${imageUri}-${index}`}
              style={{ width: index === 0 || previewImages.length === 1 ? "100%" : "48%" }}
              className={`${index === 0 ? "h-44" : "h-28"} overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350`}
            >
              <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
              {post.images.length > 4 && index === 3 ? (
                <View className="absolute inset-0 items-center justify-center bg-gray-900/60">
                  <Text size="sm" weight="bold" className="text-light-50">
                    +{post.images.length - 4}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      <View
        className={`mt-3 ${actionRowClassName} items-center gap-3 border-t border-gray-100 pt-3 dark:border-dark-400`}
      >
        <Pressable
          onPress={handleToggleLike}
          className={`${actionItemClassName} items-center gap-1 rounded-full px-2 py-1`}
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
        <Pressable
          onPress={handleSharePost}
          disabled={isSharing}
          className={`${actionItemClassName} items-center gap-1 rounded-full px-2 py-1 ${
            isSharing ? "opacity-60" : "opacity-100"
          }`}
          accessibilityRole="button"
          accessibilityLabel={`مشاركة منشور ${post.publisher.name}`}
        >
          <SharesIcon size={16} color="#9CA3AF" strokeWidth={2.25} />
          <Text size="xs" className="text-gray-500 dark:text-gray-300">
            {post.stats.shares}
          </Text>
        </Pressable>
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
              color={isOptionsOpen ? "#405d72" : "#9CA3AF"}
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
                        <Text size="xs" className="text-dark-100 dark:text-light-50">
                          تعديل المنشور
                        </Text>
                        <Pencil size={15} color="#405d72" strokeWidth={2.25} />
                      </Pressable>
                    ) : null}

                    {canArchiveOwnPost ? (
                      <Pressable
                        onPress={handleArchiveOwnPost}
                        className={`mt-1 ${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                        accessibilityRole="button"
                        accessibilityLabel="أرشفة المنشور"
                      >
                        <Text size="xs" className="text-dark-100 dark:text-light-50">
                          أرشفة المنشور
                        </Text>
                        <Archive size={15} color="#405d72" strokeWidth={2.25} />
                      </Pressable>
                    ) : null}

                    <Pressable
                      onPress={handleDeleteOwnPost}
                      className={`mt-1 ${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                      accessibilityRole="button"
                      accessibilityLabel="حذف المنشور"
                    >
                      <Text size="xs" className="text-error-300">
                        حذف المنشور
                      </Text>
                      <Trash2 size={15} color="#DC2626" strokeWidth={2.25} />
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={isSavedPostList ? handleUnsavePost : handleTogglePostSaved}
                      className={`${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                      accessibilityRole="button"
                      accessibilityLabel={isSaved ? "إلغاء حفظ المنشور" : "حفظ المنشور"}
                    >
                      <Text size="xs" className="text-dark-100 dark:text-light-50">
                        {isSaved ? "إلغاء الحفظ" : "حفظ المنشور"}
                      </Text>
                      <BookmarkIcon
                        size={15}
                        color={isSaved ? "#405d72" : "#9CA3AF"}
                        fill={isSaved ? "#405d72" : "transparent"}
                        strokeWidth={2.25}
                      />
                    </Pressable>

                    <Pressable
                      onPress={handleReportPost}
                      className={`mt-1 ${actionItemClassName} items-center justify-between rounded-lg px-3 py-2`}
                      accessibilityRole="button"
                      accessibilityLabel="إبلاغ عن المنشور"
                    >
                      <Text size="xs" className="text-error-300">
                        إبلاغ عن المنشور
                      </Text>
                      <ShieldIcon size={15} color="#DC2626" strokeWidth={2.25} />
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </View>

      {showCta && hasCta ? (
        <View className="mt-3">
          <Button
            fullWidth
            size="small"
            variant={ctaVariant}
            disabled={isSubmitted || isClosed}
            onPress={() => {
              void handlePrimaryAction();
            }}
          >
            {isClosed ? "مغلق" : ctaLabel}
          </Button>
        </View>
      ) : null}

      <Dialog
        visible={pendingOwnPostAction !== null}
        title={
          pendingOwnPostAction === "delete"
            ? "حذف المنشور"
            : pendingOwnPostAction === "archive"
              ? "أرشفة المنشور"
              : "تأكيد التعديلات"
        }
        titleColor={pendingOwnPostAction === "delete" ? "error" : undefined}
        message={
          pendingOwnPostAction === "delete"
            ? "هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذه العملية."
            : pendingOwnPostAction === "archive"
              ? "هل تريد نقل هذا المنشور إلى المنشورات المؤرشفة بدل إبقائه ظاهراً ضمن منشوراتك؟"
              : "هل تريد فتح صفحة التعديل ومراجعة التغييرات قبل إعادة إرسال المنشور؟"
        }
        icon={
          pendingOwnPostAction === "delete" ? (
            <Trash2 size={28} color="#DC2626" strokeWidth={2.25} />
          ) : pendingOwnPostAction === "archive" ? (
            <Archive size={28} color="#405d72" strokeWidth={2.25} />
          ) : (
            <Pencil size={28} color="#405d72" strokeWidth={2.25} />
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
              pendingOwnPostAction === "delete"
                ? "حذف المنشور"
                : pendingOwnPostAction === "archive"
                  ? "أرشفة"
                  : "متابعة التعديل",
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
        options={reportTypeOptions}
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
            disabled={otherReportReason.trim().length < 3}
            onPress={handleSubmitOtherReason}
          >
            إرسال البلاغ
          </Button>
        </View>
      </Dialog>

      <Dialog
        visible={isReportSuccessOpen}
        title="تم إرسال البلاغ بنجاح"
        message={`شكراً لك. سنقوم بمراجعة البلاغ قريبًا.${lastReportType ? `\nنوع البلاغ: ${lastReportType}` : ""}`}
        icon={<ShieldIcon size={26} color="#405d72" strokeWidth={2.25} />}
        onClose={() => setIsReportSuccessOpen(false)}
        buttons={[
          {
            text: "حسنًا",
            variant: "primary",
            onPress: () => setIsReportSuccessOpen(false),
          },
        ]}
      />
    </Card>
  );
}
