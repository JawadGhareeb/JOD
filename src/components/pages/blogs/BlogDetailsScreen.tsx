import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { FullScreenImageGallery } from "@/src/components/shared/FullScreenImageGallery";
import { useArticle } from "@/src/features/articles/queries";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

export function BlogDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const articleId = Array.isArray(id) ? id[0] : id;
  const query = useArticle(articleId);
  const article = query.data;
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const images = useMemo(() => {
    if (!article) return [];
    const mediaImages = [...(article.media ?? [])]
      .filter((item) => !item.prop || item.prop === "images")
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((item) => item.url);
    return Array.from(new Set([...(article.images ?? []), ...mediaImages].filter(Boolean)));
  }, [article]);

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="المقال" />
      {query.isLoading ? (
        <View className="gap-3">
          <CardSkeleton height={220} margin={0} />
          <CardSkeleton height={320} margin={0} />
        </View>
      ) : !article ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">تعذر العثور على المقال.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <Text variant="heading" weight="bold" className="text-dark-100 dark:text-light-50">{article.title}</Text>
          <View className="mt-3 flex-row-reverse items-center gap-2">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">{article.authorName || "فريق جود"}</Text>
            {article.publishedAt ? <Text size="2xs" className="text-gray-500 dark:text-gray-300">• {formatRelativeDateAr(article.publishedAt)}</Text> : null}
          </View>
          {images.length > 0 ? (
            <View className="mt-5 gap-3">
              {images.map((uri, index) => (
                <Pressable
                  key={`${uri}-${index}`}
                  onPress={() => setGalleryIndex(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`فتح صورة المقال ${index + 1}`}
                  className="overflow-hidden rounded-2xl"
                >
                  <Image
                    source={{ uri }}
                    className="h-56 w-full bg-gray-100 dark:bg-dark-350"
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          ) : null}
          {article.excerpt ? <Text size="sm" weight="medium" className="mt-5 leading-7 text-gray-700 dark:text-gray-200">{article.excerpt}</Text> : null}
          <Text size="sm" className="mt-5 leading-8 text-dark-100 dark:text-light-50">{article.content}</Text>
        </ScrollView>
      )}
      <FullScreenImageGallery
        images={images}
        visible={galleryIndex !== null}
        initialIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
      />
    </View>
  );
}
