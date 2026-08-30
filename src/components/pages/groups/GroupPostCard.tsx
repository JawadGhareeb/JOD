import { useState } from "react";
import { Pressable, View } from "react-native";
import { Heart, MessageCircle } from "lucide-react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { GROUP_ROLE_LABELS, type GroupPost } from "@/src/features/groups/types";
import { GroupCommentsSheet } from "./GroupCommentsSheet";

const MUTED = "#9CA3AF";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

type GroupPostCardProps = {
  readonly post: GroupPost;
};

export function GroupPostCard({ post }: GroupPostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const isStaff = post.author.role !== "member";

  return (
    <Card padding="md" className="mb-3 gap-3 border-gray-200 dark:border-dark-400">
      <View className="flex-row-reverse items-center gap-2">
        <Avatar name={post.author.name} imageUrl={post.author.avatarUrl} size={36} />
        <View className="flex-1">
          <View className="flex-row-reverse items-center gap-1.5">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              {post.author.name}
            </Text>
            {isStaff ? (
              <View className="rounded-full bg-primary-400/10 px-2 py-0.5">
                <Text size="2xs" className="text-primary-400">
                  {GROUP_ROLE_LABELS[post.author.role]}
                </Text>
              </View>
            ) : null}
          </View>
          <Text size="2xs" className="mt-0.5 text-gray-500 dark:text-gray-300">
            {post.createdAtLabel}
          </Text>
        </View>
      </View>

      <Text size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
        {post.body}
      </Text>

      <View className="flex-row-reverse items-center gap-4 border-t border-gray-100 pt-3 dark:border-dark-400">
        <View className="flex-row-reverse items-center gap-1">
          <Heart size={13} color={MUTED} strokeWidth={2.25} />
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {formatCount(post.likesCount)}
          </Text>
        </View>

        <Pressable
          onPress={() => setIsCommentsOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`عرض تعليقات منشور ${post.author.name}`}
          hitSlop={8}
          className="flex-row-reverse items-center gap-1"
        >
          <MessageCircle size={13} color={MUTED} strokeWidth={2.25} />
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {formatCount(post.commentsCount)}
          </Text>
          <Text size="2xs" weight="medium" className="text-primary-400">
            التعليقات
          </Text>
        </Pressable>
      </View>

      <GroupCommentsSheet
        post={post}
        visible={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />
    </Card>
  );
}
