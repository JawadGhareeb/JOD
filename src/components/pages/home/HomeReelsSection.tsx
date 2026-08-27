import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, ScrollView, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
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
        <SectionHeader title="ريلز جود" />
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
                onPress={() => router.push({ pathname: "/(tabs)/reels", params: { videoId: video.id } })}
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
      </ScrollView>

      {!loading ? (
        <Pressable
          onPress={() => router.push("/(tabs)/reels")}
          accessibilityRole="button"
          accessibilityLabel="مشاهدة كل الريلز"
          className="mx-4 mt-3 flex-row-reverse items-center justify-center gap-2 rounded-xl border border-primary-400/30 bg-primary-400/10 px-4 py-3"
        >
          <Text size="xs" weight="semibold" className="text-primary-400">
            مشاهدة كل الريلز
          </Text>
          <ArrowIcon size={16} color={primaryColor} strokeWidth={2.25} />
        </Pressable>
      ) : null}
    </View>
  );
}
