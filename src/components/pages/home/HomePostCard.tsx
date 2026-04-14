import { useMemo, useState } from "react";
import { Image, Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { appIcons } from "@/src/components/layout/iconMap";
import { HomePost } from "@/src/types/home";

type HomePostCardProps = {
  post: HomePost;
};

const MAX_CONTENT = 120;

function formatRelativeDate(isoDate: string): string {
  const now = Date.now();
  const created = new Date(isoDate).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export function HomePostCard({ post }: HomePostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = post.content.length > MAX_CONTENT;
  const displayContent = useMemo(() => {
    if (expanded || !shouldTruncate) return post.content;
    return `${post.content.slice(0, MAX_CONTENT).trim()}...`;
  }, [expanded, shouldTruncate, post.content]);

  const BookmarkIcon = appIcons.savedPosts;
  const HeartIcon = appIcons.myDonations;

  return (
    <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="mb-3 flex-row-reverse items-center justify-between">
        <View className="flex-row-reverse items-center gap-2">
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
              @{post.publisher.username} • {formatRelativeDate(post.createdAt)}
            </Text>
          </View>
        </View>
        <BookmarkIcon
          size={18}
          color={post.saved ? "#405d72" : "#9CA3AF"}
          strokeWidth={2.25}
        />
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
        <Text size="xs" className="text-gray-500 dark:text-gray-300">
          {post.stats.comments} تعليق
        </Text>
        <Text size="xs" className="text-gray-500 dark:text-gray-300">
          {post.stats.shares} مشاركة
        </Text>
      </View>
    </Card>
  );
}
