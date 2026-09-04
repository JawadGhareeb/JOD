import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View, type ViewToken } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import Text from "@/src/components/ui/Text";
import { usePublicMedia } from "@/src/features/media/queries";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { ReelVideoItem } from "./ReelVideoItem";

const REELS_PAGE_SIZE = 6;
const REEL_GAP = 12;

export function ReelsScreen() {
  const params = useLocalSearchParams<{ videoId?: string | string[] }>();
  const selectedId = Array.isArray(params.videoId) ? params.videoId[0] : params.videoId;
  const query = usePublicMedia({ perPage: REELS_PAGE_SIZE });
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [screenFocused, setScreenFocused] = useState(false);
  const [pageHeight, setPageHeight] = useState(1);
  const listRef = useRef<FlatList<(typeof items)[number]>>(null);
  const didScrollToSelected = useRef(false);
  const activeIdRef = useRef<string | null>(null);

  const setActiveReel = useCallback((id: string | null) => {
    activeIdRef.current = id;
    setActiveId(id);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => {
        setScreenFocused(false);
        setActiveReel(null);
      };
    }, [setActiveReel]),
  );

  const availableHeight = Math.max(430, pageHeight);
  const cardHeight = Math.min(620, Math.max(430, Math.round(availableHeight * 0.76)));

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<(typeof items)[number]>[] }) => {
      const visibleEntries = viewableItems.filter((entry) => entry.isViewable);
      const visibleIds = new Set(visibleEntries.map((entry) => entry.item.id));
      const primaryVisible = visibleEntries.reduce<(typeof visibleEntries)[number] | null>((current, entry) => {
        if (!current) return entry;
        return (entry.index ?? Number.MAX_SAFE_INTEGER) < (current.index ?? Number.MAX_SAFE_INTEGER) ? entry : current;
      }, null);

      if (primaryVisible && activeIdRef.current !== primaryVisible.item.id) {
        setActiveReel(primaryVisible.item.id);
      } else if (activeIdRef.current && !visibleIds.has(activeIdRef.current)) {
        setActiveReel(null);
      }

      const furthestVisibleIndex = Math.max(-1, ...viewableItems.map((entry) => entry.index ?? -1));
      if (furthestVisibleIndex >= items.length - 3 && query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage();
      }
    },
    [items.length, query, setActiveReel],
  );
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 55 }).current;

  if (selectedId && !didScrollToSelected.current && items.length > 0 && pageHeight > 1) {
    const index = items.findIndex((item) => item.id === selectedId);
    if (index >= 0) {
      requestAnimationFrame(() => listRef.current?.scrollToIndex({ index, animated: false }));
      didScrollToSelected.current = true;
    }
  }

  if (query.isLoading && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-300">
        <ActivityIndicator color={PRIMARY_COLOR_LIGHT} />
        <Text size="xs" className="mt-3 text-gray-500 dark:text-gray-300">جارِ تحميل الريلز...</Text>
      </View>
    );
  }

  if (query.isError && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 px-6 dark:bg-dark-300">
        <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">تعذر تحميل الريلز. حاول مرة أخرى.</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-light-100 dark:bg-dark-300"
      onLayout={(event) => setPageHeight(Math.max(1, event.nativeEvent.layout.height))}
    >
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: REEL_GAP }} />}
        renderItem={({ item }) => (
          <ReelVideoItem
            video={item}
            active={screenFocused && item.id === activeId}
            height={cardHeight}
            onPlayRequest={() => setActiveReel(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        snapToInterval={cardHeight + REEL_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        onEndReachedThreshold={0.25}
        ListFooterComponent={query.isFetchingNextPage ? <View className="items-center py-5"><ActivityIndicator size="small" color={PRIMARY_COLOR_LIGHT} /></View> : <View className="h-4" />}
      />
    </View>
  );
}
