import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { appIcons } from "@/src/components/layout/iconMap";
import { getArticleImageUrl, getArticlePreviewText } from "@/src/features/articles/helpers";
import type { MobileArticle } from "@/src/features/articles/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { getPrimaryColor } from "@/src/theme";

const BlogsIcon = appIcons.blogs;
const ArrowIcon = appIcons.chevronLeft;

type Props = {
  items: MobileArticle[];
  loading?: boolean;
};

export function HomeBlogsSection({ items, loading = false }: Props) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  if (!loading && items.length === 0) return null;

  const openArticle = (id: string) => router.push({ pathname: "/blogs/[id]", params: { id } });

  return (
    <View className="mb-4 rounded-2xl bg-white py-3 dark:bg-dark-500">
      <View className="px-4">
        <SectionHeader title="مقالات جود" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 4 }}
      >
        {loading
          ? [0, 1, 2].map((key) => <CardSkeleton key={key} width={260} height={300} margin={0} />)
          : items.map((article) => {
              const imageUrl = getArticleImageUrl(article);
              const preview = getArticlePreviewText(article);
              return (
                <Card
                  key={article.id}
                  padding="none"
                  className="w-[260px] overflow-hidden border-gray-200 dark:border-dark-400"
                  onPress={() => openArticle(article.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`عرض تفاصيل المقال ${article.title}`}
                >
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      className="h-36 w-full bg-gray-100 dark:bg-dark-350"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-36 w-full items-center justify-center bg-primary-100 dark:bg-dark-350">
                      <BlogsIcon size={30} color={primaryColor} strokeWidth={2} />
                    </View>
                  )}

                  <View className="p-3">
                    <Text numberOfLines={2} weight="semibold" size="xs" className="leading-6 text-dark-100 dark:text-light-50">
                      {article.title}
                    </Text>
                    {article.publishedAt ? (
                      <Text size="2xs" className="mt-1 text-gray-400 dark:text-gray-300">
                        {formatRelativeDateAr(article.publishedAt)}
                      </Text>
                    ) : null}
                    {preview ? (
                      <View className="mt-2 flex-row-reverse items-end gap-2">
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          size="2xs"
                          className="flex-1 leading-5 text-gray-500 dark:text-gray-300"
                        >
                          {preview}
                        </Text>
                        <Pressable
                          onPress={(event) => {
                            event.stopPropagation();
                            openArticle(article.id);
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`عرض المزيد عن ${article.title}`}
                          className="rounded-full bg-primary-400/10 px-2.5 py-1.5"
                        >
                          <Text size="2xs" weight="semibold" className="text-primary-400">
                            عرض المزيد
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                </Card>
              );
            })}
      </ScrollView>

      {!loading ? (
        <Pressable
          onPress={() => router.push("/blogs")}
          accessibilityRole="button"
          accessibilityLabel="عرض كل المقالات"
          className="mx-4 mt-3 flex-row-reverse items-center justify-center gap-2 rounded-xl border border-primary-400/30 bg-primary-400/10 px-4 py-3"
        >
          <Text size="xs" weight="semibold" className="text-primary-400">
            عرض كل المقالات
          </Text>
          <ArrowIcon size={16} color={primaryColor} strokeWidth={2.25} />
        </Pressable>
      ) : null}
    </View>
  );
}
