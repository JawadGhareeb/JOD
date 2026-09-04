import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import { VideoPlayer } from "@/src/components/shared/VideoPlayer";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { getReelPlaybackUrl } from "@/src/features/media/helpers";
import type { PublicMediaItem } from "@/src/features/media/types";
import { getPrimaryColor } from "@/src/theme";

const ReelsIcon = appIcons.reels;
const PlayIcon = appIcons.play;
const ArrowIcon = appIcons.chevronLeft;
const CARD_WIDTH = 180;
const CARD_GAP = 12;
const PREVIEW_HEIGHT = 300;

type Props = {
  items: PublicMediaItem[];
  loading?: boolean;
  active?: boolean;
};

function HomeReelStreamCard({
  video,
  sectionActive,
  playing,
  onOpen,
}: {
  video: PublicMediaItem;
  sectionActive: boolean;
  playing: boolean;
  onOpen: () => void;
}) {
  const playbackUrl = getReelPlaybackUrl(video);

  return (
    <View style={{ width: CARD_WIDTH }} className="overflow-hidden rounded-2xl bg-dark-500">
      <View style={{ height: PREVIEW_HEIGHT }} className="items-center justify-center bg-dark-350">
        {sectionActive ? (
          <VideoPlayer
            url={playbackUrl}
            active={playing}
            loop
            muted
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <View className="items-center justify-center">
            <ReelsIcon size={34} color="#D1D5DB" strokeWidth={2} />
            <View className="mt-3 h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <PlayIcon size={21} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
        )}
        <Pressable
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel="فتح الفيديو الكامل"
          className="absolute inset-0"
        />
      </View>
    </View>
  );
}

export function HomeReelsSection({ items, loading = false, active = false }: Props) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const firstItemId = items[0]?.id ?? null;
  const [activePreviewId, setActivePreviewId] = useState<string | null>(firstItemId);

  useEffect(() => {
    setActivePreviewId(firstItemId);
  }, [firstItemId]);

  if (!loading && items.length === 0) return null;

  const openVideo = (videoId: string) => {
    router.push({ pathname: "/(tabs)/reels", params: { videoId } });
  };

  const updateHorizontalPreview = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (items.length === 0) return;
    const index = Math.max(
      0,
      Math.min(items.length - 1, Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP))),
    );
    setActivePreviewId(items[index]?.id ?? null);
  };

  return (
    <View className="mb-4 rounded-2xl bg-white py-3 dark:bg-dark-500">
      <View className="px-4">
        <SectionHeader title="ريلز جود" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        onMomentumScrollEnd={updateHorizontalPreview}
        onScrollEndDrag={updateHorizontalPreview}
        contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: 16, paddingBottom: 4 }}
      >
        {loading
          ? [0, 1, 2].map((key) => (
              <CardSkeleton key={key} width={CARD_WIDTH} height={PREVIEW_HEIGHT} margin={0} />
            ))
          : items.map((video) => (
              <HomeReelStreamCard
                key={video.id}
                video={video}
                sectionActive={active}
                playing={active && activePreviewId === video.id}
                onOpen={() => openVideo(video.id)}
              />
            ))}
      </ScrollView>

      {!loading ? (
        <Pressable
          onPress={() => router.push("/(tabs)/reels")}
          accessibilityRole="button"
          accessibilityLabel="مشاهدة كل الريلز"
          className="mx-4 mt-3 flex-row-reverse items-center justify-center gap-2 rounded-xl border border-primary-400/30 bg-primary-400/10 px-4 py-3"
        >
          <Text size="xs" weight="semibold" className="text-primary-400">مشاهدة كل الريلز</Text>
          <ArrowIcon size={16} color={primaryColor} strokeWidth={2.25} />
        </Pressable>
      ) : null}
    </View>
  );
}
