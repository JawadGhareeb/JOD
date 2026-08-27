import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View, type ViewToken } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import Text from "@/src/components/ui/Text";
import { usePublicMedia } from "@/src/features/media/queries";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";
import { ReelVideoItem } from "./ReelVideoItem";

export function ReelsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ videoId?: string | string[] }>();
  const selectedId = Array.isArray(params.videoId) ? params.videoId[0] : params.videoId;
  const query = usePublicMedia({ perPage: 20 });
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const [activeId, setActiveId] = useState<string | null>(selectedId ?? null);
  const [screenFocused, setScreenFocused] = useState(false);
  const [pageHeight, setPageHeight] = useState(1);
  const listRef = useRef<FlatList<(typeof items)[number]>>(null);
  const didScrollToSelected = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => {
        setScreenFocused(false);
        setActiveId(null);
      };
    }, []),
  );

  useEffect(() => {
    if (activeId === null && screenFocused && items[0]) setActiveId(items[0].id);
  }, [activeId, items, screenFocused]);

  useEffect(() => {
    if (!selectedId || didScrollToSelected.current || pageHeight <= 1) return;
    const index = items.findIndex((item) => item.id === selectedId);
    if (index < 0) return;
    requestAnimationFrame(() => listRef.current?.scrollToIndex({ index, animated: false }));
    setActiveId(selectedId);
    didScrollToSelected.current = true;
  }, [items, pageHeight, selectedId]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<(typeof items)[number]>[] }) => {
      const visible = viewableItems.find((entry) => entry.isViewable)?.item;
      if (visible) setActiveId(visible.id);
    },
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;
  const headerHeight = 64;
  const usableHeight = Math.max(420, pageHeight - headerHeight);

  if (query.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-300">
        <ActivityIndicator color={PRIMARY_COLOR_LIGHT} />
        <Text size="xs" className="mt-3 text-gray-500 dark:text-gray-300">جارِ تحميل الريلز...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-light-100 px-6 dark:bg-dark-300">
        <Text size="sm" className="text-center text-gray-500 dark:text-gray-300">تعذر تحميل الريلز. حاول مرة أخرى.</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-light-100 dark:bg-dark-300"
      style={{ paddingTop: insets.top }}
      onLayout={(event) => setPageHeight(Math.max(1, event.nativeEvent.layout.height - insets.top))}
    >
      <View className="h-16 flex-row-reverse items-center justify-between border-b border-gray-100 bg-white px-4 dark:border-dark-400 dark:bg-dark-500">
        <Text weight="bold" size="lg" className="text-dark-100 dark:text-light-50">ريلز جود</Text>
        <Pressable
          onPress={() => router.push("/search")}
          className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350"
          accessibilityLabel="البحث"
        >
          <Search size={20} color={PRIMARY_COLOR_LIGHT} />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReelVideoItem video={item} active={screenFocused && item.id === activeId} height={usableHeight} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        getItemLayout={(_, index) => ({ length: usableHeight, offset: usableHeight * index, index })}
      />
    </View>
  );
}
