import { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Pencil, Trash2, Eye, Heart } from "lucide-react-native";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { API_TYPE_TO_POST_TYPE } from "@/src/features/posts/api";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import type { ApiPostType, HomePostType, MyPost, MyPostStatus } from "@/src/features/posts/types";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";

const STATUS_LABELS: Record<MyPostStatus, string> = {
  published: "منشور",
  pending: "قيد المراجعة",
  blocked: "مرفوض",
  draft: "مسودة",
};

const STATUS_CLASSES: Record<MyPostStatus, string> = {
  published: "bg-primary-400/15 text-primary-400",
  pending: "bg-warning-100 text-warning-400",
  blocked: "bg-error-100 text-error-300",
  draft: "bg-gray-100 text-gray-600 dark:bg-dark-350 dark:text-gray-200",
};

type Props = {
  post: MyPost;
  authorName: string;
  authorUsername?: string | null;
  onDelete: (id: string) => Promise<void>;
};

export function MyPostCard({ post, authorName, authorUsername, onDelete }: Props) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const mappedType = (API_TYPE_TO_POST_TYPE[post.type as ApiPostType] ?? post.type) as HomePostType;
  const typeLabel = HOME_POST_TYPE_LABELS[mappedType] ?? post.type;
  const blockReason = post.status === "blocked" ? post.blockReason?.trim() : "";
  const canEdit = post.status === "draft" || post.status === "blocked";

  return (
    <Card padding="none" className="mb-4 overflow-hidden border-gray-200 dark:border-dark-400">
      <View className="p-4">
        <View className="mb-3 flex-row-reverse items-start justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row-reverse items-center gap-2">
            <Avatar name={authorName} size={42} />
            <View className="min-w-0 flex-1 items-end">
              <Text numberOfLines={1} weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">{authorName}</Text>
              <Text numberOfLines={1} size="2xs" className="text-gray-500 dark:text-gray-300">{authorUsername ? `@${authorUsername} • ` : ""}{formatHomePostRelativeDate(post.createdAt)}</Text>
            </View>
          </View>
          <View className={`rounded-full px-2.5 py-1 ${STATUS_CLASSES[post.status].split(" text-")[0]}`}>
            <Text size="2xs" weight="semibold" className={STATUS_CLASSES[post.status].includes("text-") ? STATUS_CLASSES[post.status].substring(STATUS_CLASSES[post.status].indexOf("text-")) : "text-primary-400"}>{STATUS_LABELS[post.status]}</Text>
          </View>
        </View>

        <View className="mb-3 flex-row-reverse items-center gap-2">
          <View className="rounded-full bg-primary-400/10 px-2.5 py-1"><Text size="2xs" className="text-primary-400">{typeLabel}</Text></View>
          {post.city ? <Text size="2xs" className="text-gray-500 dark:text-gray-300">{post.city}</Text> : null}
        </View>

        <Text weight="semibold" size="base" className="mb-2 text-right text-dark-100 dark:text-light-50">{post.title}</Text>
        <Text size="sm" className="mb-3 text-right leading-6 text-gray-600 dark:text-gray-200">{post.details}</Text>

        {post.images.length > 0 ? (
          post.images.length === 1 ? (
            <Image source={{ uri: post.images[0] }} className="h-52 w-full rounded-2xl bg-gray-100 dark:bg-dark-350" resizeMode="cover" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {post.images.map((image) => <Image key={image} source={{ uri: image }} className="h-48 w-64 rounded-2xl bg-gray-100 dark:bg-dark-350" resizeMode="cover" />)}
            </ScrollView>
          )
        ) : null}

        {blockReason ? (
          <View className="mt-3 rounded-2xl border border-error-200 bg-error-100/60 p-3 dark:bg-error-300/10">
            <Text size="2xs" weight="semibold" className="mb-1 text-error-300">سبب الرفض</Text>
            <Text size="xs" className="text-right text-error-300">{blockReason}</Text>
          </View>
        ) : null}

        {post.status === "pending" ? (
          <View className="mt-3 rounded-2xl bg-warning-100/70 p-3 dark:bg-warning-400/10">
            <Text size="xs" className="text-right text-warning-400">المنشور حالياً عند الإدارة للمراجعة، ولا يمكن تعديله قبل انتهاء المراجعة.</Text>
          </View>
        ) : null}

        <View className="mt-4 flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
          <View className="flex-row-reverse items-center gap-4">
            <View className="flex-row-reverse items-center gap-1"><Eye size={17} color="#9CA3AF" /><Text size="2xs" className="text-gray-500 dark:text-gray-300">{post.viewsCount ?? 0}</Text></View>
            <View className="flex-row-reverse items-center gap-1"><Heart size={17} color="#9CA3AF" /><Text size="2xs" className="text-gray-500 dark:text-gray-300">{post.reactionsCount ?? 0}</Text></View>
          </View>

          <View className="flex-row-reverse items-center gap-1">
            {canEdit ? (
              <Pressable onPress={() => router.push({ pathname: "/create-post", params: { postId: post.id } } as never)} className="size-9 items-center justify-center rounded-full bg-primary-100 dark:bg-dark-350" accessibilityLabel="تعديل المنشور">
                <Pencil size={17} color={PRIMARY_COLOR_LIGHT} />
              </Pressable>
            ) : null}
            <Pressable onPress={() => setDeleteDialogOpen(true)} className="size-9 items-center justify-center rounded-full bg-error-100 dark:bg-error-300/10" accessibilityLabel="حذف المنشور"><Trash2 size={17} color="#E5484D" /></Pressable>
          </View>
        </View>
      </View>

      <Dialog
        visible={deleteDialogOpen}
        title="حذف المنشور نهائياً؟"
        message={`سيتم حذف «${post.title}» وصوره من حسابك. هذا الإجراء نهائي ولا يمكن التراجع عنه.`}
        cancelable={!isDeleting}
        icon={<Trash2 size={28} color="#E5484D" />}
        onClose={() => { if (!isDeleting) setDeleteDialogOpen(false); }}
        buttons={[
          { text: "إبقاء المنشور", variant: "outline", onPress: () => { if (!isDeleting) setDeleteDialogOpen(false); } },
          {
            text: "حذف نهائي",
            variant: "primary",
            className: "bg-error-300",
            loading: isDeleting,
            onPress: async () => {
              setIsDeleting(true);
              try { await onDelete(post.id); setDeleteDialogOpen(false); } finally { setIsDeleting(false); }
            },
          },
        ]}
      />
    </Card>
  );
}
