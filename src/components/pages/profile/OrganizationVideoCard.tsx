import { Pressable, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { VideoPlayer } from "@/src/components/shared/VideoPlayer";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type { PublicMediaItem } from "@/src/features/media/types";

const PlayIcon = appIcons.play;

export function OrganizationVideoCard({
  video,
  active,
  onPlay,
}: {
  video: PublicMediaItem;
  active: boolean;
  onPlay: () => void;
}) {
  return (
    <Card padding="none" className="mb-3 overflow-hidden border-gray-200 dark:border-dark-400">
      {active ? (
        <VideoPlayer url={video.url} active nativeControls style={{ width: "100%", height: 220 }} />
      ) : (
        <Pressable
          onPress={onPlay}
          accessibilityRole="button"
          accessibilityLabel={`تشغيل الفيديو ${video.originalName}`}
          className="h-[220px] items-center justify-center bg-dark-350"
        >
          <View className="h-16 w-16 items-center justify-center rounded-full bg-black/60">
            <PlayIcon size={28} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text size="2xs" className="mt-3 text-light-50">
            تشغيل الفيديو
          </Text>
        </Pressable>
      )}
      <View className="p-4">
        <Text numberOfLines={1} weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
          {video.originalName}
        </Text>
        <Text numberOfLines={4} size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
          {video.description || "فيديو من المنظمة"}
        </Text>
      </View>
    </Card>
  );
}
