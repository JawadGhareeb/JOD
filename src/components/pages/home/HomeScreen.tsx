import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from "react-native";
import { mockHomePayload } from "@/src/data/mockHome";
import { AppHeader } from "@/src/components/layout/AppHeader";
import Text from "@/src/components/ui/Text";
import { HomePostCard } from "./HomePostCard";
import { HomePostCardSkeleton } from "./HomePostCardSkeleton";

export function HomeScreen() {
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(92);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const isHeaderVisibleRef = useRef(true);
  const lastOffsetYRef = useRef(0);
  const directionalDeltaRef = useRef(0);
  const filteredPosts = useMemo(() => mockHomePayload.posts, []);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
      setLoadingMore(false);
    }, 550);
  };

  const showHeader = useCallback(() => {
    if (isHeaderVisibleRef.current) return;
    isHeaderVisibleRef.current = true;
    Animated.timing(headerTranslateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [headerTranslateY]);

  const hideHeader = useCallback(() => {
    if (!headerHeight || !isHeaderVisibleRef.current) return;
    isHeaderVisibleRef.current = false;
    Animated.timing(headerTranslateY, {
      toValue: -headerHeight,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [headerHeight, headerTranslateY]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const delta = offsetY - lastOffsetYRef.current;
      lastOffsetYRef.current = offsetY;

      if (offsetY <= 0) {
        directionalDeltaRef.current = 0;
        showHeader();
        return;
      }

      if (offsetY < headerHeight) {
        directionalDeltaRef.current = 0;
        showHeader();
        return;
      }

      if (Math.abs(delta) < 1) {
        return;
      }

      if (
        directionalDeltaRef.current === 0 ||
        Math.sign(directionalDeltaRef.current) !== Math.sign(delta)
      ) {
        directionalDeltaRef.current = delta;
      } else {
        directionalDeltaRef.current += delta;
      }

      if (directionalDeltaRef.current > 14) {
        hideHeader();
        directionalDeltaRef.current = 0;
      } else if (directionalDeltaRef.current < -14) {
        showHeader();
        directionalDeltaRef.current = 0;
      }
    },
    [headerHeight, hideHeader, showHeader],
  );

  const handleRefresh = useCallback(() => {
    showHeader();
    setRefreshing(true);
    setLoadingMore(false);
    setTimeout(() => {
      setVisibleCount(PAGE_SIZE);
      setRefreshing(false);
    }, 650);
  }, [showHeader]);

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <Animated.View
        onLayout={(event) => {
          const measuredHeight = Math.ceil(event.nativeEvent.layout.height);
          if (measuredHeight > 0 && measuredHeight !== headerHeight) {
            setHeaderHeight(measuredHeight);
          }
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <AppHeader />
      </Animated.View>

      <FlatList
        className="flex-1 bg-light-100 px-4 dark:bg-dark-300"
        contentContainerStyle={{ paddingTop: headerHeight + 16, paddingBottom: 24 }}
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HomePostCard post={item} enableAuthorNavigation />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#405d72" />
        }
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              لا توجد منشورات لعرضها حالياً.
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-2">
              <HomePostCardSkeleton />
            </View>
          ) : hasMore ? (
            <View className="py-3" />
          ) : (
            <View className="items-center py-4">
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                تم عرض جميع المنشورات
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
