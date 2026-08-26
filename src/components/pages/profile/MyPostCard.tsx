import { useState } from "react";
import { Image, View } from "react-native";
import { useRouter } from "expo-router";
import { Archive, RotateCcw, Trash2 } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Text from "@/src/components/ui/Text";
import { API_TYPE_TO_POST_TYPE } from "@/src/features/posts/api";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import type { ApiPostType, HomePostType, MyPost, MyPostStatus } from "@/src/features/posts/types";
import { getPrimaryColor } from "@/src/theme";

const MAX_DETAILS = 120;

const STATUS_LABELS: Record<MyPostStatus, string> = {
  draft: "مسودة",
  pending: "قيد المراجعة",
  active: "منشور",
  rejected: "مرفوض",
  archived: "مؤرشف",
};

const STATUS_BADGE_CLASSNAME: Record<MyPostStatus, string> = {
  draft: "bg-gray-100 dark:bg-dark-350",
  pending: "bg-amber-100 dark:bg-dark-350",
  active: "bg-success-100/15",
  rejected: "bg-error-300/10",
  archived: "bg-gray-100 dark:bg-dark-350",
};

const STATUS_TEXT_CLASSNAME: Record<MyPostStatus, string> = {
  draft: "text-gray-500 dark:text-gray-300",
  pending: "text-amber-700 dark:text-amber-400",
  active: "text-success-100",
  rejected: "text-error-300",
  archived: "text-gray-500 dark:text-gray-300",
};

type PendingAction = "archive" | "delete" | "repost" | null;

interface MyPostCardProps {
  readonly post: MyPost;
  readonly onArchive: (postId: string) => Promise<void>;
  readonly onDelete: (postId: string) => Promise<void>;
  readonly onRepost: (postId: string) => Promise<void>;
}

export function MyPostCard({ post, onArchive, onDelete, onRepost }: MyPostCardProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const details = post.details ?? "";
  const shouldTruncate = details.length > MAX_DETAILS;
  const displayDetails = shouldTruncate
    ? `${details.slice(0, MAX_DETAILS).trim()}...`
    : details;

  const canEdit = post.status === "draft" || post.status === "rejected";
  const canArchive = post.status === "active";
  const canRepost = post.status === "archived";

  const handleEdit = () => {
    const postType = API_TYPE_TO_POST_TYPE[post.type as ApiPostType] ?? "help";

    router.push({
      pathname: "/(tabs)/create-post",
      params: {
        mode: "edit",
        postId: post.id,
        postType,
        title: post.title || "",
        details: post.details || "",
        city: post.city || "",
        images: post.images.join("|"),
      },
    });
  };

  const runPendingAction = async () => {
    const action = pendingAction;
    setPendingAction(null);
    if (!action) return;

    setIsProcessing(true);
    try {
      if (action === "archive") await onArchive(post.id);
      if (action === "delete") await onDelete(post.id);
      if (action === "repost") await onRepost(post.id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="mb-2 flex-row-reverse flex-wrap items-center gap-2">
        <View className={`rounded-full px-3 py-1 ${STATUS_BADGE_CLASSNAME[post.status]}`}>
          <Text size="2xs" weight="medium" className={STATUS_TEXT_CLASSNAME[post.status]}>
            {STATUS_LABELS[post.status]}
          </Text>
        </View>
        <View className="rounded-full bg-primary-400/15 px-3 py-1">
          <Text size="2xs" weight="medium" className="text-primary-400">
            {HOME_POST_TYPE_LABELS[post.type as HomePostType] || post.type}
          </Text>
        </View>
      </View>

      {post.title ? (
        <Text weight="semibold" size="sm" className="mb-1 text-dark-100 dark:text-light-50">
          {post.title}
        </Text>
      ) : null}

      {details ? (
        <Text size="sm" className="text-dark-100 dark:text-light-50">
          {displayDetails}
        </Text>
      ) : null}

      {post.images.length > 0 ? (
        <View className="mt-3 h-32 w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350">
          <Image source={{ uri: post.images[0] }} className="h-full w-full" resizeMode="cover" />
        </View>
      ) : null}

      {post.status === "rejected" && post.rejectionReason ? (
        <View className="mt-3 rounded-xl bg-error-300/10 p-3">
          <Text size="xs" weight="semibold" className="text-error-300">
            سبب الرفض
          </Text>
          <Text size="xs" className="mt-1 text-error-300">
            {post.rejectionReason}
          </Text>
        </View>
      ) : null}

      <View className="mt-3 flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
        <Text size="2xs" className="text-gray-500 dark:text-gray-300">
          {post.city || "مدينة غير محددة"}
        </Text>
        <Text size="2xs" className="text-gray-500 dark:text-gray-300">
          {post.createdAt ? formatHomePostRelativeDate(post.createdAt) : ""}
        </Text>
      </View>

      <View className="mt-3 flex-row-reverse flex-wrap gap-2">
        {canEdit ? (
          <Button size="small" variant="outline" onPress={handleEdit}>
            تعديل
          </Button>
        ) : null}
        {canArchive ? (
          <Button size="small" variant="outline" onPress={() => setPendingAction("archive")}>
            أرشفة
          </Button>
        ) : null}
        {canRepost ? (
          <Button size="small" variant="outline" onPress={() => setPendingAction("repost")}>
            إعادة نشر
          </Button>
        ) : null}
        <Button
          size="small"
          variant="tertiary"
          className="border border-error-300/30 bg-error-300/5"
          onPress={() => setPendingAction("delete")}
        >
          حذف
        </Button>
      </View>

      <Dialog
        visible={pendingAction !== null}
        title={
          pendingAction === "delete"
            ? "حذف المنشور"
            : pendingAction === "archive"
              ? "أرشفة المنشور"
              : "إعادة نشر المنشور"
        }
        titleColor={pendingAction === "delete" ? "error" : undefined}
        message={
          pendingAction === "delete"
            ? "هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذه العملية."
            : pendingAction === "archive"
              ? "سيتم نقل هذا المنشور إلى الأرشيف ولن يظهر ضمن المنشورات النشطة."
              : "سيتم إعادة إرسال هذا المنشور للمراجعة قبل ظهوره مجدداً."
        }
        icon={
          pendingAction === "delete" ? (
            <Trash2 size={28} color="#DC2626" strokeWidth={2.25} />
          ) : pendingAction === "archive" ? (
            <Archive size={28} color={primaryColor} strokeWidth={2.25} />
          ) : (
            <RotateCcw size={28} color={primaryColor} strokeWidth={2.25} />
          )
        }
        onClose={() => {
          if (!isProcessing) setPendingAction(null);
        }}
        cancelable={!isProcessing}
        buttons={[
          {
            text: "تراجع",
            variant: "tertiary",
            onPress: () => setPendingAction(null),
          },
          {
            text:
              pendingAction === "delete"
                ? "حذف"
                : pendingAction === "archive"
                  ? "أرشفة"
                  : "إعادة نشر",
            variant: "primary",
            className: pendingAction === "delete" ? "bg-error-300 shadow-error-300/30" : undefined,
            loading: isProcessing,
            onPress: () => void runPendingAction(),
          },
        ]}
      />
    </Card>
  );
}
