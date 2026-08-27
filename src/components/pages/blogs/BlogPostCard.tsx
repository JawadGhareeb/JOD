import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, Pressable, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { getArticleImageUrl, getArticlePreviewText } from "@/src/features/articles/helpers";
import type { MobileArticle } from "@/src/features/articles/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { getPrimaryColor } from "@/src/theme";

type Props = { post: MobileArticle };
const ClockIcon = appIcons.clock;
const BlogsIcon = appIcons.blogs;
const ArrowIcon = appIcons.chevronLeft;

export function BlogPostCard({ post }: Props) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const publishedAt = post.publishedAt ?? post.createdAt;
  const readTime = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 180));
  const imageUrl = getArticleImageUrl(post);
  const preview = getArticlePreviewText(post);
  const openArticle = () => router.push({ pathname: "/blogs/[id]", params: { id: post.id } });

  return (
    <Card
      padding="none"
      className="mb-3 overflow-hidden border-gray-200 dark:border-dark-400"
      onPress={openArticle}
      accessibilityRole="button"
      accessibilityLabel={`عرض تفاصيل المقال ${post.title}`}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="h-44 w-full bg-gray-100 dark:bg-dark-350" resizeMode="cover" />
      ) : (
        <View className="h-40 w-full items-center justify-center bg-primary-100 dark:bg-dark-350">
          <BlogsIcon size={34} color={primaryColor} strokeWidth={2} />
        </View>
      )}

      <View className="p-4">
        <Text size="2xs" className="text-gray-500 dark:text-gray-300">
          {publishedAt ? formatRelativeDateAr(publishedAt) : ""}
        </Text>
        <Text numberOfLines={2} weight="semibold" size="sm" className="mt-2 leading-7 text-dark-100 dark:text-light-50">
          {post.title}
        </Text>

        {preview ? (
          <View className="mt-2 flex-row-reverse items-end gap-3">
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              size="xs"
              className="flex-1 leading-6 text-gray-600 dark:text-gray-200"
            >
              {preview}
            </Text>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                openArticle();
              }}
              accessibilityRole="button"
              accessibilityLabel={`عرض المزيد عن ${post.title}`}
              className="flex-row-reverse items-center gap-1 rounded-full bg-primary-400/10 px-3 py-2"
            >
              <Text size="2xs" weight="semibold" className="text-primary-400">
                عرض المزيد
              </Text>
              <ArrowIcon size={12} color={primaryColor} strokeWidth={2.25} />
            </Pressable>
          </View>
        ) : null}

        <View className="mt-4 flex-row-reverse items-center border-t border-gray-100 pt-3 dark:border-dark-400">
          <ClockIcon size={14} color="#9CA3AF" strokeWidth={2.25} />
          <Text size="2xs" className="mr-2 text-gray-500 dark:text-gray-300">
            {readTime} دقائق قراءة
          </Text>
        </View>
      </View>
    </Card>
  );
}
