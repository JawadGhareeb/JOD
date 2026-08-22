import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { usePostsByOrganization } from "@/src/features/posts/queries";

const BackIcon = appIcons.chevronRight;

export function AuthorProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const authorId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = usePostsByOrganization(authorId);

  const posts = data?.items ?? [];

  // No dedicated "get publisher profile" endpoint exists — the publisher
  // object embedded in their own posts is the only source for this info.
  const author = posts[0]?.publisher;

  const totalLikes = useMemo(
    () => posts.reduce((sum, post) => sum + post.stats.likes, 0),
    [posts],
  );
  const totalShares = useMemo(
    () => posts.reduce((sum, post) => sum + post.stats.shares, 0),
    [posts],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 px-4 dark:bg-dark-300">
        <Text size="sm" className="text-gray-500 dark:text-gray-300">
          جارِ تحميل ملف الناشر...
        </Text>
      </View>
    );
  }

  if (!author) {
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
            ملف الناشر
          </Text>

          <View className="h-10 w-10" />
        </View>

        <View className="flex-1 items-center justify-center px-3">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            لم يتم العثور على الناشر
          </Text>
          <Text size="xs" className="mt-2 text-center leading-6 text-gray-500 dark:text-gray-300">
            هذا الحساب غير متوفر حالياً أو أن الرابط غير صحيح.
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/home")}
            className="mt-4 rounded-xl bg-primary-400 px-4 py-2"
            accessibilityRole="button"
            accessibilityLabel="العودة إلى الرئيسية"
          >
            <Text size="xs" weight="medium" className="text-light-50">
              العودة إلى الرئيسية
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-light-100 px-4 dark:bg-dark-300"
      contentContainerStyle={{ paddingBottom: 24 }}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HomePostCard post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
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
              ملف الناشر
            </Text>

            <View className="h-10 w-10" />
          </View>

          <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-start gap-3">
              <Avatar name={author.name} size={56} />

              <View className="flex-1">
                <View className="flex-row-reverse items-center gap-1">
                  <Text weight="semibold" size="base" className="text-dark-100 dark:text-light-50">
                    {author.name}
                  </Text>
                  {author.verified ? (
                    <Text size="2xs" className="text-primary-400">
                      موثق
                    </Text>
                  ) : null}
                </View>

                <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  @{author.username}
                  {author.city ? ` • ${author.city}` : ""}
                </Text>

                <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
                  {author.bio || "ينشر هذا الحساب محتوى إنساني وتحديثات عن الحملات المجتمعية."}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row-reverse justify-between gap-2 border-t border-gray-100 pt-3 dark:border-dark-400">
              <View className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
                <Text weight="semibold" size="sm" className="text-primary-400">
                  {posts.length}
                </Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  المنشورات
                </Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
                <Text weight="semibold" size="sm" className="text-primary-400">
                  {totalLikes}
                </Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  الإعجابات
                </Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
                <Text weight="semibold" size="sm" className="text-primary-400">
                  {totalShares}
                </Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  المشاركات
                </Text>
              </View>
            </View>
          </Card>

          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">
            منشورات الناشر
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            لا توجد منشورات لهذا الناشر حالياً.
          </Text>
        </View>
      }
    />
  );
}
