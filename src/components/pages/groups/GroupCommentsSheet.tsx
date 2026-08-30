import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal as RNModal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useColorScheme } from "nativewind";
import { Heart, SendHorizonal } from "lucide-react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Text from "@/src/components/ui/Text";
import {
  useAddGroupComment,
  useGroupComments,
  useToggleGroupCommentLike,
} from "@/src/features/groups/queries";
import {
  GROUP_ROLE_LABELS,
  type GroupComment,
  type GroupCommentThread,
  type GroupPost,
} from "@/src/features/groups/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

const CloseIcon = appIcons.close;
const MUTED = "#9CA3AF";
/** Matches `text-error-300` in the Tailwind palette. */
const LIKED_COLOR = "#DC2626";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

type GroupCommentsSheetProps = {
  readonly post: GroupPost;
  readonly visible: boolean;
  readonly onClose: () => void;
};

type ReplyTarget = { id: string; name: string } | null;

export function GroupCommentsSheet({ post, visible, onClose }: GroupCommentsSheetProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryColor = getPrimaryColor(isDark);
  const { requireAuth } = useAuthGuard();
  const toast = useToast();

  const [draft, setDraft] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);

  const commentsQuery = useGroupComments(post.id, visible);
  const addComment = useAddGroupComment();
  const toggleLike = useToggleGroupCommentLike(post.id);

  // A draft aimed at another post's thread must never survive reopening.
  useEffect(() => {
    if (visible) {
      setDraft("");
      setReplyTarget(null);
    }
  }, [visible]);

  const threads = commentsQuery.data ?? [];
  const canSend = draft.trim().length > 0 && !addComment.isPending;

  const submit = () => {
    if (!canSend || !requireAuth()) return;
    addComment.mutate(
      { postId: post.id, parentId: replyTarget?.id ?? null, body: draft.trim() },
      {
        onSuccess: () => {
          setDraft("");
          setReplyTarget(null);
        },
        onError: () => toast.error("تعذر إرسال التعليق. حاول مرة أخرى."),
      },
    );
  };

  const like = (commentId: string) => {
    if (!requireAuth()) return;
    toggleLike.mutate(commentId);
  };

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className={`h-[82%] w-full rounded-t-3xl ${isDark ? "bg-dark-500" : "bg-white"}`}
        >
          <KeyboardAvoider offsetIOS={12}>
            <View className="flex-row-reverse items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-400">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                التعليقات ({formatCount(post.commentsCount)})
              </Text>
              <Pressable
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-lg"
                accessibilityRole="button"
                accessibilityLabel="إغلاق"
              >
                <CloseIcon size={18} color={isDark ? "#E5E7EB" : "#6B7280"} />
              </Pressable>
            </View>

            <CommentsBody
              threads={threads}
              isLoading={commentsQuery.isLoading}
              primaryColor={primaryColor}
              onLike={like}
              onReply={(comment) => setReplyTarget({ id: comment.id, name: comment.author.name })}
            />

            <View className="border-t border-gray-200 px-4 py-3 dark:border-dark-400">
              {replyTarget ? (
                <View className="mb-2 flex-row-reverse items-center justify-between rounded-lg bg-primary-400/10 px-3 py-1.5">
                  <Text size="2xs" className="text-primary-400">
                    ترد على {replyTarget.name}
                  </Text>
                  <Pressable
                    onPress={() => setReplyTarget(null)}
                    accessibilityRole="button"
                    accessibilityLabel="إلغاء الرد"
                    hitSlop={8}
                  >
                    <CloseIcon size={14} color={primaryColor} />
                  </Pressable>
                </View>
              ) : null}

              <View className="flex-row-reverse items-center gap-2">
                <View className="flex-1">
                  <Input
                    multiline
                    showStatusIcon={false}
                    value={draft}
                    onChangeText={setDraft}
                    placeholder={replyTarget ? "اكتب ردك…" : "اكتب تعليقاً…"}
                    placeholderTextColor={MUTED}
                    maxLength={500}
                  />
                </View>
                <Pressable
                  onPress={submit}
                  disabled={!canSend}
                  accessibilityRole="button"
                  accessibilityLabel={replyTarget ? "إرسال الرد" : "إرسال التعليق"}
                  accessibilityState={{ disabled: !canSend }}
                  className={`size-11 items-center justify-center rounded-xl ${canSend ? "bg-primary-400" : "bg-gray-200 dark:bg-dark-400"}`}
                >
                  {addComment.isPending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <SendHorizonal size={18} color="#FFFFFF" strokeWidth={2.25} />
                  )}
                </Pressable>
              </View>
            </View>
          </KeyboardAvoider>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

function CommentsBody({
  threads,
  isLoading,
  primaryColor,
  onLike,
  onReply,
}: {
  readonly threads: GroupCommentThread[];
  readonly isLoading: boolean;
  readonly primaryColor: string;
  readonly onLike: (commentId: string) => void;
  readonly onReply: (comment: GroupComment) => void;
}) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={primaryColor} />
      </View>
    );
  }

  if (threads.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text size="xs" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
          لا توجد تعليقات بعد. كن أول من يعلّق.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, gap: 16 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {threads.map((thread) => (
        <View key={thread.id} className="gap-3">
          <CommentRow comment={thread} onLike={onLike} onReply={onReply} />
          {thread.replies.map((reply) => (
            <View key={reply.id} style={{ paddingRight: 34 }}>
              <CommentRow comment={reply} onLike={onLike} onReply={onReply} />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function CommentRow({
  comment,
  onLike,
  onReply,
}: {
  readonly comment: GroupComment;
  readonly onLike: (commentId: string) => void;
  readonly onReply: (comment: GroupComment) => void;
}) {
  const isStaff = comment.author.role !== "member";

  return (
    <View className="flex-row-reverse items-start gap-2">
      <Avatar name={comment.author.name} imageUrl={comment.author.avatarUrl} size={32} />

      <View className="flex-1 gap-1">
        <View className="rounded-2xl bg-gray-50 px-3 py-2 dark:bg-dark-350">
          <View className="flex-row-reverse items-center gap-1.5">
            <Text size="2xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              {comment.author.name}
            </Text>
            {isStaff ? (
              <View className="rounded-full bg-primary-400/10 px-1.5 py-0.5">
                <Text size="2xs" className="text-primary-400">
                  {GROUP_ROLE_LABELS[comment.author.role]}
                </Text>
              </View>
            ) : null}
          </View>
          <Text size="xs" className="mt-1 leading-5 text-gray-600 dark:text-gray-200">
            {comment.body}
          </Text>
        </View>

        <View className="flex-row-reverse items-center gap-4 px-1">
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {comment.createdAtLabel}
          </Text>

          <Pressable
            onPress={() => onLike(comment.id)}
            accessibilityRole="button"
            accessibilityLabel={comment.isLiked ? "إلغاء الإعجاب" : "إعجاب"}
            accessibilityState={{ selected: comment.isLiked }}
            hitSlop={8}
            className="flex-row-reverse items-center gap-1"
          >
            <Heart
              size={13}
              color={comment.isLiked ? LIKED_COLOR : MUTED}
              fill={comment.isLiked ? LIKED_COLOR : "transparent"}
              strokeWidth={2.25}
            />
            {comment.likesCount > 0 ? (
              <Text
                size="2xs"
                className={comment.isLiked ? "text-error-300" : "text-gray-500 dark:text-gray-300"}
              >
                {formatCount(comment.likesCount)}
              </Text>
            ) : null}
          </Pressable>

          <Pressable
            onPress={() => onReply(comment)}
            accessibilityRole="button"
            accessibilityLabel={`الرد على ${comment.author.name}`}
            hitSlop={8}
          >
            <Text size="2xs" weight="medium" className="text-primary-400">
              رد
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
