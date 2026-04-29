import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { BLOG_CATEGORY_LABELS, getMockBlogPostById } from "@/src/data/mockBlogs";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

const BackIcon = appIcons.chevronRight;
const ClockIcon = appIcons.clock;

export function BlogDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const blogId = Array.isArray(id) ? id[0] : id;
  const post = useMemo(
    () => (blogId ? getMockBlogPostById(blogId) : undefined),
    [blogId],
  );

  if (!post) {
    return (
      <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
        <View
          style={{ paddingTop: Math.max(insets.top, 8) }}
          className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
        >
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
            accessibilityRole="button"
            accessibilityLabel="رجوع"
          >
            <BackIcon size={20} color="#405d72" strokeWidth={2.25} />
          </Pressable>

          <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
            تفاصيل المقال
          </Text>

          <View className="h-10 w-10" />
        </View>

        <View className="flex-1 items-center justify-center px-3">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            المقال غير موجود
          </Text>
          <Text size="xs" className="mt-2 text-center leading-6 text-gray-500 dark:text-gray-300">
            لا يمكن العثور على هذا المقال، قد يكون تم حذفه أو الرابط غير صحيح.
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/blogs")}
            className="mt-4 rounded-xl bg-primary-400 px-4 py-2"
            accessibilityRole="button"
            accessibilityLabel="العودة إلى المدونات"
          >
            <Text size="xs" weight="medium" className="text-light-50">
              العودة إلى المدونات
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <View
        style={{ paddingTop: Math.max(insets.top, 8) }}
        className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
          accessibilityRole="button"
          accessibilityLabel="رجوع"
        >
          <BackIcon size={20} color="#405d72" strokeWidth={2.25} />
        </Pressable>

        <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
          تفاصيل المقال
        </Text>

        <View className="h-10 w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {post.coverImage ? (
          <Image source={{ uri: post.coverImage }} className="h-52 w-full rounded-2xl" resizeMode="cover" />
        ) : null}

        <View className="mt-4 flex-row-reverse items-center justify-between">
          <View className="rounded-full bg-primary-400/15 px-3 py-1">
            <Text size="2xs" weight="medium" className="text-primary-400">
              {BLOG_CATEGORY_LABELS[post.category]}
            </Text>
          </View>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {formatRelativeDateAr(post.publishedAt)}
          </Text>
        </View>

        <Text weight="semibold" size="lg" className="mt-3 leading-9 text-dark-100 dark:text-light-50">
          {post.title}
        </Text>

        <View className="mt-3 flex-row-reverse items-center justify-between">
          <Text size="xs" className="text-gray-500 dark:text-gray-300">
            بقلم {post.author.name}
          </Text>
          <View className="flex-row-reverse items-center gap-1">
            <ClockIcon size={14} color="#9CA3AF" strokeWidth={2.25} />
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {post.readTimeMinutes} دقائق قراءة
            </Text>
          </View>
        </View>

        <Text size="sm" className="mt-5 leading-7 text-gray-700 dark:text-gray-200">
          {post.excerpt}
        </Text>

        {post.content
          .split("\n\n")
          .filter(Boolean)
          .map((paragraph, index) => (
            <Text
              key={`${post.id}-paragraph-${index + 1}`}
              size="sm"
              className="mt-4 leading-8 text-gray-700 dark:text-gray-200"
            >
              {paragraph}
            </Text>
          ))}
      </ScrollView>
    </View>
  );
}
