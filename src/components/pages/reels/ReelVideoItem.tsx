import { View } from "react-native";
import Text from "@/src/components/ui/Text";
import { VideoPlayer } from "@/src/components/shared/VideoPlayer";
import type { PublicMediaItem } from "@/src/features/media/types";

export function ReelVideoItem({
  video,
  active,
  height,
}: {
  video: PublicMediaItem;
  active: boolean;
  height: number;
}) {
  return (
    <View style={{ height }} className="bg-black">
      <VideoPlayer url={video.url} active={active} style={{ flex: 1 }} />
      <View className="absolute bottom-0 left-0 right-0 bg-black/45 px-4 pb-8 pt-8">
        <Text size="sm" weight="semibold" className="text-light-50">
          فيديو من جود
        </Text>
        <Text numberOfLines={4} size="xs" className="mt-2 leading-6 text-light-50">
          {video.description || video.originalName}
        </Text>
      </View>
    </View>
  );
}
