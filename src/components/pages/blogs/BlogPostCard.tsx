import { useRouter } from "expo-router";
import { View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type { MobileArticle } from "@/src/features/articles/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

type Props = { post: MobileArticle };
const ClockIcon = appIcons.clock;
const ArrowIcon = appIcons.chevronLeft;

export function BlogPostCard({ post }: Props) {
  const router = useRouter();
  const publishedAt = post.publishedAt ?? post.createdAt;
  const readTime = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 180));

  return (
    <Card padding="none" className="mb-3 overflow-hidden border-gray-200 dark:border-dark-400" onPress={() => router.push({ pathname: "/blogs/[id]", params: { id: post.id } })} accessibilityRole="button" accessibilityLabel={`عرض تفاصيل المقال ${post.title}`}>
      <View className="p-4">
        <Text size="2xs" className="text-gray-500 dark:text-gray-300">{publishedAt ? formatRelativeDateAr(publishedAt) : ""}</Text>
        <Text weight="semibold" size="sm" className="mt-2 text-dark-100 dark:text-light-50">{post.title}</Text>
        {post.excerpt ? <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">{post.excerpt}</Text> : null}
        <View className="mt-4 flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
          <View className="flex-row-reverse items-center gap-2"><ClockIcon size={14} color="#9CA3AF" strokeWidth={2.25} /><Text size="2xs" className="text-gray-500 dark:text-gray-300">{readTime} دقائق قراءة</Text></View>
          <View className="flex-row-reverse items-center gap-1"><Text size="xs" weight="medium" className="text-primary-400">قراءة المقال</Text><ArrowIcon size={14} color="#405d72" strokeWidth={2.25} /></View>
        </View>
      </View>
    </Card>
  );
}
