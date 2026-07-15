import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { appIcons } from "@/src/components/layout/iconMap";
import type { BlogPost } from "@/src/types/blogs";

type BlogPostCardProps = {
  post: BlogPost;
};

const ClockIcon = appIcons.clock;
const ArrowIcon = appIcons.chevronLeft;

export function BlogPostCard({ post }: BlogPostCardProps) {
  const router = useRouter();

  const handleOpenDetails = () => {
    router.push({
      pathname: "/blogs/[id]",
      params: { id: post.id },
    });
  };

  return (
    <Card
      padding="none"
      className="mb-3 overflow-hidden border-gray-200 dark:border-dark-400"
      onPress={handleOpenDetails}
      accessibilityRole="button"
      accessibilityLabel={`عرض تفاصيل المقال ${post.title}`}
    >
      {post.coverImage ? (
        <Image source={{ uri: post.coverImage }} className="h-44 w-full" resizeMode="cover" />
      ) : null}

      <View className="p-4">
        <View className="mb-3 flex-row-reverse items-center justify-between">
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {formatRelativeDateAr(post.publishedAt)}
          </Text>
        </View>

        <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
          {post.title}
        </Text>

        <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
          {post.excerpt}
        </Text>

        <View className="mt-4 flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
          <View className="flex-row-reverse items-center gap-2">
            <ClockIcon size={14} color="#9CA3AF" strokeWidth={2.25} />
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {post.readTimeMinutes} دقائق قراءة
            </Text>
          </View>

          <View className="flex-row-reverse items-center gap-1">
            <Text size="xs" weight="medium" className="text-primary-400">
              قراءة المقال
            </Text>
            <ArrowIcon size={14} color="#405d72" strokeWidth={2.25} />
          </View>
        </View>
      </View>
    </Card>
  );
}
