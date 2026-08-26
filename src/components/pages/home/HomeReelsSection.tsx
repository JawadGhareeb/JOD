import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, ScrollView, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import type { PublicMediaItem } from "@/src/features/media/types";
import { getPrimaryColor } from "@/src/theme";

const ReelsIcon = appIcons.reels;
const PlayIcon = appIcons.play;
const ArrowIcon = appIcons.chevronLeft;

type Props = {
  items: PublicMediaItem[];
  loading?: boolean;
};

export function HomeReelsSection({ items, loading = false }: Props) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  if (!loading && items.length === 0) return null;

  return (
    <View className="mb-4 rounded-2xl bg-white py-3 dark:bg-dark-500">
      <View className="px-4">
        <SectionHeader
          title="ريلز جود"
          actionLabel="مشاهدة الكل"
          onActionPress={() => router.push("/(tabs)/reels")}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 4 }}
      >
        {loading
          ? [0, 1, 2].map((key) => <CardSkeleton key={key} width={150} height={220} margin={0} />)
          : items.map((video) => (
              <Pressable
                key={video.id}
                onPress={() =>
                  router.push({ pathname: "/(tabs)/reels", params: { videoId: video.id } })
                }
                accessibilityRole="button"
                accessibilityLabel="تشغيل الفيديو"
                className="w-[150px] overflow-hidden rounded-2xl bg-dark-500"
              >
                <View className="h-[170px] items-center justify-center bg-dark-350">
                  <ReelsIcon size={30} color="#D1D5DB" strokeWidth={2} />
                  <View className="mt-3 h-11 w-11 items-center justify-center rounded-full bg-white/15">
                    <PlayIcon size={20} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                </View>
                <View className="min-h-[54px] px-3 py-2">
                  <Text numberOfLines={2} size="2xs" className="leading-5 text-light-50">
                    {video.description || video.originalName}
                  </Text>
                </View>
              </Pressable>
            ))}

        {!loading ? (
          <Card
            padding="md"
            className="h-[224px] w-[120px] items-center justify-center border-gray-200 dark:border-dark-400"
            onPress={() => router.push("/(tabs)/reels")}
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
