import { useState } from "react";
import { Pressable, View } from "react-native";
import { Heart, MessageCircle, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Avatar } from "@/src/components/shared/Avatar";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/features/auth/queries";
import { useApproveGroupPost, useDeleteGroupPost, useRejectGroupPost, useToggleGroupPostLike, useVoteGroupPoll } from "@/src/features/groups/queries";
import { GROUP_ROLE_LABELS, type GroupPost } from "@/src/features/groups/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { GroupCommentsSheet } from "./GroupCommentsSheet";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

type GroupPostCardProps = { readonly post: GroupPost; readonly canManage?: boolean; };

export function GroupPostCard({ post, canManage = false }: GroupPostCardProps) {
  const router = useRouter();
  const toast = useToast();
  const { requireAuth } = useAuthGuard();
  const { user } = useAuthStatus();
  const like = useToggleGroupPostLike();
  const approve = useApproveGroupPost();
  const reject = useRejectGroupPost();
  const remove = useDeleteGroupPost();
  const vote = useVoteGroupPoll();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const canDelete = canManage || user?.id === post.author?.id;

  const toggleLike = async () => {
    if (!requireAuth()) return;
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((count) => Math.max(0, count + (next ? 1 : -1)));
    try {
      const result = await like.mutateAsync({ postId: post.id, liked: next });
      setIsLiked(result.isLiked); setLikesCount(result.likesCount);
    } catch {
      setIsLiked(!next); setLikesCount(post.likesCount); toast.error("تعذر تحديث الإعجاب.");
    }
  };

  return (
    <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
      <Pressable onPress={() => post.author?.id && router.push({ pathname: "/author/[id]", params: { id: post.author.id } })} className="flex-row-reverse items-center gap-2">
        <Avatar name={post.author?.name ?? "عضو"} imageUrl={post.author?.avatarUrl} size={38} />
        <View className="flex-1"><Text size="xs" weight="semibold">{post.author?.name ?? "عضو"}</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">{post.author ? GROUP_ROLE_LABELS[post.author.role] : "عضو"} • {post.createdAtLabel}</Text></View>
      </Pressable>
      {post.title ? <Text size="sm" weight="semibold">{post.title}</Text> : null}
      <Text size="xs" className="leading-6">{post.body}</Text>
      {post.rejectionReason ? <Text size="2xs" className="rounded-lg bg-error-100 p-2 text-error-500">سبب الرفض: {post.rejectionReason}</Text> : null}

      {post.poll ? <View className="gap-2 rounded-xl bg-gray-50 p-3 dark:bg-dark-350"><Text size="xs" weight="semibold">{post.poll.question}</Text>{post.poll.options.map((option) => {
        const selected = post.poll?.selectedOptionIds.includes(option.id);
        return <Pressable key={option.id} disabled={vote.isPending} onPress={() => requireAuth() && void vote.mutateAsync({ postId: post.id, optionIds: [option.id] })} className={`overflow-hidden rounded-xl border p-3 ${selected ? "border-primary-400" : "border-gray-200 dark:border-dark-400"}`}><View className="flex-row-reverse justify-between"><Text size="2xs">{option.label}</Text><Text size="2xs" weight="semibold">{option.percentage}%</Text></View><View className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200"><View style={{ width: `${Math.min(100, option.percentage)}%` }} className="h-full bg-primary-400" /></View></Pressable>;
      })}<Text size="2xs" className="text-gray-500">{post.poll.totalVotes.toLocaleString("ar-SY")} مصوّت</Text></View> : null}

      <View className="flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
        <View className="flex-row-reverse gap-4">
          <Pressable onPress={() => void toggleLike()} className="flex-row-reverse items-center gap-1"><Heart size={18} color={isLiked ? "#E5484D" : "#9CA3AF"} fill={isLiked ? "#E5484D" : "transparent"} /><Text size="2xs" className="text-gray-500">{formatCount(likesCount)}</Text></Pressable>
          <Pressable onPress={() => setCommentsOpen(true)} className="flex-row-reverse items-center gap-1"><MessageCircle size={18} color="#9CA3AF" /><Text size="2xs" className="text-gray-500">{formatCount(post.commentsCount)}</Text></Pressable>
        </View>
        {canDelete ? <Pressable onPress={() => void remove.mutateAsync({ groupId: post.groupId, postId: post.id })} hitSlop={8}><Trash2 size={17} color="#E5484D" /></Pressable> : null}
      </View>

      {canManage && post.status === "pending" ? <View className="gap-2 border-t border-gray-100 pt-3 dark:border-dark-400"><View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth size="small" loading={approve.isPending} onPress={() => void approve.mutateAsync({ groupId: post.groupId, postId: post.id })}>قبول ونشر</Button></View><View className="flex-1"><Button fullWidth size="small" variant="tertiary" onPress={() => setRejecting((value) => !value)}>رفض</Button></View></View>{rejecting ? <View className="gap-2"><Input fullWidth value={reason} onChangeText={setReason} placeholder="سبب الرفض" showStatusIcon={false} /><Button fullWidth size="small" variant="tertiary" disabled={reason.trim().length < 3} loading={reject.isPending} onPress={() => void reject.mutateAsync({ groupId: post.groupId, postId: post.id, reason: reason.trim() })}>تأكيد الرفض</Button></View> : null}</View> : null}
      <GroupCommentsSheet post={post} visible={commentsOpen} onClose={() => setCommentsOpen(false)} />
    </Card>
  );
}
