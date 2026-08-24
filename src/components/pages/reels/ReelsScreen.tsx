import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, LayoutChangeEvent, View, ViewToken } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Text from "@/src/components/ui/Text";
import { usePublicMedia } from "@/src/features/media/queries";
import type { PublicMediaItem } from "@/src/features/media/types";
import { ReelVideoItem } from "./ReelVideoItem";

export function ReelsScreen() {
  const { videoId } = useLocalSearchParams<{ videoId?: string | string[] }>();
  const selectedId = Array.isArray(videoId) ? videoId[0] : videoId;
  const query = usePublicMedia({ perPage: 20 });
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const [activeId, setActiveId] = useState<string | null>(selectedId ?? null);
  const [pageHeight, setPageHeight] = useState(1);
  const listRef = useRef<FlatList<PublicMediaItem>>(null);
  const didScrollToSelected = useRef(false);

  const onLayout = (event: LayoutChangeEvent) => {
    setPageHeight(Math.max(1, event.nativeEvent.layout.height));
  };

  useEffect(() => {
    if (!selectedId || didScrollToSelected.current) return;
    const index = items.findIndex((item) => item.id === selectedId);
    if (index >= 0 && pageHeight > 1) {
      requestAnimationFrame(() => listRef.current?.scrollToIndex({ index, animated: false }));
      setActiveId(selectedId);
      didScrollToSelected.current = true;
      return;
    }
    if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
  }, [items, pageHeight, query, selectedId]);

  useEffect(() => {
    if (!activeId && items[0]) setActiveId(items[0].id);
  }, [activeId, items]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<PublicMediaItem>[] }) => {
      const visible = viewableItems.find((token) => token.isViewable)?.item;
      if (visible) setActiveId(visible.id);
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  if (query.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FFFFFF" />
        <Text size="xs" className="mt-3 text-light-50">جارِ تحميل الريلز...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text size="sm" rtlAlign="center" className="text-light-50">تعذر تحميل الفيديوهات حالياً.</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text size="sm" rtlAlign="center" className="text-light-50">لا توجد فيديوهات متاحة حالياً.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black" onLayout={onLayout}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReelVideoItem video={item} active={activeId === item.id} height={pageHeight} />}
        pagingEnabled
        snapToInterval={pageHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: pageHeight, offset: pageHeight * index, index })}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        onEndReachedThreshold={0.6}
        ListFooterComponent={query.isFetchingNextPage ? <ActivityIndicator color="#FFFFFF" /> : null}
      />
    </View>
  );
}
