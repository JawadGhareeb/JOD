import { Image, Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";

type FeedMediaGridProps = {
  images: string[];
  onPress?: (index: number) => void;
};

export function FeedMediaGrid({ images, onPress }: FeedMediaGridProps) {
  const normalizedImages = images.filter(Boolean);
  const preview = normalizedImages.slice(0, 4);
  if (preview.length === 0) return null;

  const extraCount = Math.max(0, normalizedImages.length - 4);
  const image = (uri: string, index: number, className: string) => (
    <Pressable
      key={`${uri}-${index}`}
      onPress={() => onPress?.(index)}
      disabled={!onPress}
      className={`overflow-hidden bg-gray-200 dark:bg-dark-350 ${className}`}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? "فتح معرض الصور" : undefined}
    >
      <Image source={{ uri }} className="h-full w-full" resizeMode="cover" />
      {extraCount > 0 && index === 3 ? (
        <View className="absolute inset-0 items-center justify-center bg-black/55">
          <Text size="lg" weight="bold" className="text-white">+{extraCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );

  if (preview.length === 1) {
    return <View className="mt-3 h-64 overflow-hidden rounded-xl">{image(preview[0], 0, "h-full w-full")}</View>;
  }

  if (preview.length === 2) {
    return (
      <View className="mt-3 h-56 flex-row gap-0.5 overflow-hidden rounded-xl">
        <View className="flex-1">{image(preview[0], 0, "h-full w-full")}</View>
        <View className="flex-1">{image(preview[1], 1, "h-full w-full")}</View>
      </View>
    );
  }

  if (preview.length === 3) {
    return (
      <View className="mt-3 h-64 flex-row gap-0.5 overflow-hidden rounded-xl">
        <View className="flex-1">{image(preview[0], 0, "h-full w-full")}</View>
        <View className="flex-1 gap-0.5">
          <View className="flex-1">{image(preview[1], 1, "h-full w-full")}</View>
          <View className="flex-1">{image(preview[2], 2, "h-full w-full")}</View>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-3 h-64 gap-0.5 overflow-hidden rounded-xl">
      <View className="flex-1 flex-row gap-0.5">
        <View className="flex-1">{image(preview[0], 0, "h-full w-full")}</View>
        <View className="flex-1">{image(preview[1], 1, "h-full w-full")}</View>
      </View>
      <View className="flex-1 flex-row gap-0.5">
        <View className="flex-1">{image(preview[2], 2, "h-full w-full")}</View>
        <View className="flex-1">{image(preview[3], 3, "h-full w-full")}</View>
      </View>
    </View>
  );
}
