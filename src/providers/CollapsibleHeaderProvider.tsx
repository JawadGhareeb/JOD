import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Animated, Easing, type NativeSyntheticEvent, type NativeScrollEvent } from "react-native";

const SCROLL_EPSILON = 2;
const COLLAPSE_AFTER_Y = 28;
const COLLAPSE_TRAVEL = 18;
const EXPAND_TRAVEL = 12;

export const headerCollapseProgress = new Animated.Value(0);
let lastScrollY = 0;
let directionalTravel = 0;
let lastDirection: -1 | 0 | 1 = 0;
let isCollapsed = false;

function animateHeader(collapsed: boolean) {
  if (collapsed === isCollapsed) return;
  isCollapsed = collapsed;
  headerCollapseProgress.stopAnimation();
  Animated.timing(headerCollapseProgress, {
    toValue: collapsed ? 1 : 0,
    duration: collapsed ? 150 : 170,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();
}

export function resetHeader() {
  lastScrollY = 0;
  directionalTravel = 0;
  lastDirection = 0;
  isCollapsed = false;
  headerCollapseProgress.stopAnimation();
  headerCollapseProgress.setValue(0);
}

export function useCollapsibleHeaderScreen() {
  useFocusEffect(
    useCallback(() => {
      resetHeader();
    }, []),
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);

    if (offsetY <= SCROLL_EPSILON) {
      resetHeader();
      return;
    }

    const delta = offsetY - lastScrollY;
    if (Math.abs(delta) < SCROLL_EPSILON) return;

    const direction: -1 | 1 = delta > 0 ? 1 : -1;
    if (direction !== lastDirection) {
      directionalTravel = 0;
      lastDirection = direction;
    }
    directionalTravel += Math.abs(delta);
    lastScrollY = offsetY;

    if (direction > 0 && offsetY >= COLLAPSE_AFTER_Y && directionalTravel >= COLLAPSE_TRAVEL) {
      directionalTravel = 0;
      animateHeader(true);
      return;
    }

    if (direction < 0 && directionalTravel >= EXPAND_TRAVEL) {
      directionalTravel = 0;
      animateHeader(false);
    }
  }, []);

  return {
    onScroll,
    resetHeader,
    headerCollapseProgress,
  };
}
