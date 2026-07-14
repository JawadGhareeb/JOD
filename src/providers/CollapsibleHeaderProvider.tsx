import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Animated, type NativeSyntheticEvent, type NativeScrollEvent } from "react-native";

const SCROLL_EPSILON = 2;

export const headerScrollY = new Animated.Value(0);
let lastScrollY = 0;

export function resetHeader() {
  lastScrollY = 0;
  headerScrollY.setValue(0);
}

export function useCollapsibleHeaderScreen() {
  useFocusEffect(
    useCallback(() => {
      resetHeader();
    }, []),
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY <= 0) {
      resetHeader();
      return;
    }

    const delta = offsetY - lastScrollY;
    if (Math.abs(delta) < SCROLL_EPSILON) {
      return;
    }

    lastScrollY = offsetY;
    headerScrollY.setValue(offsetY);
  }, []);

  return {
    onScroll,
    resetHeader,
    headerScrollY,
  };
}
