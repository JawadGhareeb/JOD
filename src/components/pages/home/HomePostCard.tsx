import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Image, Pressable, Share, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import {
  buildHomePostShareLink,
  buildHomePostShareMessage,
  HOME_POST_TYPE_LABELS,
  formatHomePostRelativeDate,
} from "@/src/helpers/home";
import { HomePost } from "@/src/types/home";

type HomePostCardProps = {
  post: HomePost;
  showCta?: boolean;
  enableAuthorNavigation?: boolean;
};

const MAX_CONTENT = 120;
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

export function HomePostCard({
  post,
  showCta = true,
  enableAuthorNavigation = false,
}: HomePostCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaved, setIsSaved] = useState(Boolean(post.saved));
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOtherReasonDialogOpen, setIsOtherReasonDialogOpen] = useState(false);
  const [isReportSuccessOpen, setIsReportSuccessOpen] = useState(false);
  const [lastReportType, setLastReportType] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");
  const shouldTruncate = post.content.length > MAX_CONTENT;
  const displayContent = useMemo(() => {
    if (expanded || !shouldTruncate) return post.content;
    return `${post.content.slice(0, MAX_CONTENT).trim()}...`;
  }, [expanded, shouldTruncate, post.content]);

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
      setIsOptionsOpen(false);
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

  const handleTogglePostSaved = () => {
    const willSave = !isSaved;
    setIsSaved(willSave);
    setIsOptionsOpen(false);
    Alert.alert(
      willSave ? "تم حفظ المنشور" : "تم إزالة الحفظ",
      willSave ? "يمكنك العثور عليه لاحقًا في المنشورات المحفوظة." : "تمت إزالة المنشور من المحفوظات.",
    );
  };

  const handleReportPost = () => {
    setIsOptionsOpen(false);
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

      {post.images.length > 0 ? (
        <View className="mt-3 gap-2">
          <View className="h-44 overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350">
            <Image source={{ uri: post.images[0] }} className="h-full w-full" resizeMode="cover" />
          </View>
          {post.images.length > 1 ? (
            <View className="h-32 overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350">
              <Image source={{ uri: post.images[1] }} className="h-full w-full" resizeMode="cover" />
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="mt-3 flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
        <View className="flex-row-reverse items-center gap-1">
          <HeartIcon size={16} color="#405d72" strokeWidth={2.25} />
          <Text size="xs" className="text-gray-500 dark:text-gray-300">
            {post.stats.likes}
          </Text>
        </View>
        <Pressable
          onPress={handleSharePost}
          disabled={isSharing}
          className={`flex-row-reverse items-center gap-1 ${isSharing ? "opacity-60" : "opacity-100"}`}
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
            onPress={() => setIsOptionsOpen((prev) => !prev)}
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

          {isOptionsOpen ? (
            <View className="absolute left-0 top-9 z-20 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-dark-400 dark:bg-dark-500">
              <Pressable
                onPress={handleTogglePostSaved}
                className="flex-row-reverse items-center justify-between rounded-lg px-3 py-2"
                accessibilityRole="button"
                accessibilityLabel={isSaved ? "إلغاء حفظ المنشور" : "حفظ المنشور"}
              >
                <Text size="xs" className="text-dark-100 dark:text-light-50">
                  {isSaved ? "إلغاء الحفظ" : "حفظ المنشور"}
                </Text>
                <BookmarkIcon size={15} color="#405d72" strokeWidth={2.25} />
              </Pressable>

              <Pressable
                onPress={handleReportPost}
                className="mt-1 flex-row-reverse items-center justify-between rounded-lg px-3 py-2"
                accessibilityRole="button"
                accessibilityLabel="إبلاغ عن المنشور"
              >
                <Text size="xs" className="text-error-300">
                  إبلاغ عن المنشور
                </Text>
                <ShieldIcon size={15} color="#DC2626" strokeWidth={2.25} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      {showCta && hasCta ? (
        <View className="mt-3">
          <Button
            fullWidth
            size="small"
            variant={ctaVariant}
            disabled={isSubmitted || isClosed}
          >
            {isClosed ? "مغلق" : ctaLabel}
          </Button>
        </View>
      ) : null}

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
