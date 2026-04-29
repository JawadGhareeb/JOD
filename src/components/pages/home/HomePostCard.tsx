import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Image, Pressable, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/helpers/home";
import { HomePost } from "@/src/types/home";

type HomePostCardProps = {
  post: HomePost;
  showCta?: boolean;
  enableAuthorNavigation?: boolean;
};

const MAX_CONTENT = 120;

export function HomePostCard({
  post,
  showCta = true,
  enableAuthorNavigation = false,
}: HomePostCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = post.content.length > MAX_CONTENT;
  const displayContent = useMemo(() => {
    if (expanded || !shouldTruncate) return post.content;
    return `${post.content.slice(0, MAX_CONTENT).trim()}...`;
  }, [expanded, shouldTruncate, post.content]);

  const BookmarkIcon = appIcons.savedPosts;
  const HeartIcon = appIcons.myDonations;
  const SharesIcon = appIcons.shares;
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
        <View className="flex-row-reverse items-center gap-1">
          <SharesIcon size={16} color="#9CA3AF" strokeWidth={2.25} />
          <Text size="xs" className="text-gray-500 dark:text-gray-300">
            {post.stats.shares}
          </Text>
        </View>
        <View className="flex-row-reverse items-center gap-1">
          <BookmarkIcon
            size={16}
            color={post.saved ? "#405d72" : "#9CA3AF"}
            strokeWidth={2.25}
          />
          <Text size="xs" className="text-gray-500 dark:text-gray-300">
            {post.saved ? "محفوظ" : "حفظ"}
          </Text>
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
    </Card>
  );
}
