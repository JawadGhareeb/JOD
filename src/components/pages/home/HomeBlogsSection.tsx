import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { appIcons } from "@/src/components/layout/iconMap";
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

  return (
    <View className="mb-4 rounded-2xl bg-white py-3 dark:bg-dark-500">
      <View className="px-4">
        <SectionHeader title="مقالات جود" actionLabel="مشاهدة الكل" onActionPress={() => router.push("/blogs")} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 4 }}
      >
        {loading
          ? [0, 1, 2].map((key) => <CardSkeleton key={key} width={220} height={160} margin={0} />)
          : items.map((article) => (
              <Card
                key={article.id}
                padding="md"
                className="w-[220px] border-gray-200 dark:border-dark-400"
                onPress={() => router.push({ pathname: "/blogs/[id]", params: { id: article.id } })}
              >
                <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/15">
                  <BlogsIcon size={18} color={primaryColor} />
                </View>
                <Text numberOfLines={2} weight="semibold" size="xs" className="leading-6 text-dark-100 dark:text-light-50">
                  {article.title}
                </Text>
                {article.excerpt ? (
                  <Text numberOfLines={2} size="2xs" className="mt-2 leading-5 text-gray-500 dark:text-gray-300">
                    {article.excerpt}
                  </Text>
                ) : null}
                <Text size="2xs" className="mt-3 text-gray-400 dark:text-gray-300">
                  {article.publishedAt ? formatRelativeDateAr(article.publishedAt) : ""}
                </Text>
              </Card>
            ))}

        {!loading ? (
          <Card
            padding="md"
            className="h-[160px] w-[120px] items-center justify-center border-gray-200 dark:border-dark-400"
            onPress={() => router.push("/blogs")}
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/15">
              <ArrowIcon size={20} color={primaryColor} />
            </View>
            <Text size="xs" weight="medium" rtlAlign="center" className="mt-3 text-primary-400">
              مشاهدة الكل
            </Text>
          </Card>
        ) : null}
      </ScrollView>
    </View>
  );
}
