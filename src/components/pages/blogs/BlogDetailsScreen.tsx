import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { useArticle } from "@/src/features/articles/queries";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

export function BlogDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const articleId = Array.isArray(id) ? id[0] : id;
  const query = useArticle(articleId);
  const article = query.data;
  const images = useMemo(() => {
    if (!article) return [];
    const mediaImages = [...(article.media ?? [])]
      .filter((item) => !item.prop || item.prop === "images")
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((item) => item.url);
    return Array.from(new Set([...(article.images ?? []), ...mediaImages].filter(Boolean)));
  }, [article]);

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      {query.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">جارِ تحميل المقال...</Text>
        </View>
      ) : !article ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">تعذر العثور على المقال.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
          <Text variant="heading" weight="bold" className="text-dark-100 dark:text-light-50">{article.title}</Text>
          <View className="mt-3 flex-row-reverse items-center gap-2">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">{article.authorName || "فريق جود"}</Text>
            {article.publishedAt ? <Text size="2xs" className="text-gray-500 dark:text-gray-300">• {formatRelativeDateAr(article.publishedAt)}</Text> : null}
          </View>
          {images.length > 0 ? (
            <View className="mt-5 gap-3">
              {images.map((uri, index) => (
                <Image
                  key={`${uri}-${index}`}
                  source={{ uri }}
                  className="h-56 w-full rounded-2xl bg-gray-100 dark:bg-dark-350"
                  resizeMode="cover"
                />
              ))}
            </View>
          ) : null}
          {article.excerpt ? <Text size="sm" weight="medium" className="mt-5 leading-7 text-gray-700 dark:text-gray-200">{article.excerpt}</Text> : null}
          <Text size="sm" className="mt-5 leading-8 text-dark-100 dark:text-light-50">{article.content}</Text>
        </ScrollView>
      )}
    </View>
  );
}
