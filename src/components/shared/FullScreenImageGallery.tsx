import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { X } from "lucide-react-native";
import Text from "@/src/components/ui/Text";

type FullScreenImageGalleryProps = {
  images: string[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
};

export function FullScreenImageGallery({
  images,
  visible,
  initialIndex = 0,
  onClose,
}: FullScreenImageGalleryProps) {
  const { width, height } = useWindowDimensions();
  const normalizedImages = useMemo(() => images.filter(Boolean), [images]);
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, Math.max(0, normalizedImages.length - 1)));
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);

  useEffect(() => {
    if (visible) setActiveIndex(safeInitialIndex);
  }, [safeInitialIndex, visible]);

  if (!visible || normalizedImages.length === 0) return null;

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.max(
      0,
      Math.min(normalizedImages.length - 1, Math.round(event.nativeEvent.contentOffset.x / Math.max(1, width))),
    );
    setActiveIndex(nextIndex);
  };

  return (
    <Modal visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 bg-black">
        <FlatList
          key={`${safeInitialIndex}-${width}`}
          data={normalizedImages}
          horizontal
          pagingEnabled
          initialScrollIndex={safeInitialIndex}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          keyExtractor={(item, index) => `${item}-${index}`}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width, height }} className="items-center justify-center bg-black">
              <Image source={{ uri: item }} style={{ width, height }} resizeMode="contain" />
            </View>
          )}
        />

        <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 pt-12">
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="إغلاق معرض الصور"
            className="h-11 w-11 items-center justify-center rounded-full bg-black/55"
          >
            <X size={24} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
          <View className="rounded-full bg-black/55 px-3 py-2">
            <Text size="xs" weight="semibold" className="text-white">
              {activeIndex + 1} / {normalizedImages.length}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
