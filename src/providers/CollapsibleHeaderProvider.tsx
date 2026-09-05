import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
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

type CollapsibleHeaderScreenOptions = {
  resetOnFocus?: boolean;
  scrollEpsilon?: number;
  collapseAfterY?: number;
  collapseTravel?: number;
  expandTravel?: number;
};

function resetScrollTracking(offsetY = 0) {
  lastScrollY = Math.max(0, offsetY);
  directionalTravel = 0;
  lastDirection = 0;
}

function animateHeader(collapsed: boolean) {
  if (collapsed === isCollapsed) return;
  isCollapsed = collapsed;
  headerCollapseProgress.stopAnimation();
  Animated.timing(headerCollapseProgress, {
    toValue: collapsed ? 1 : 0,
    duration: collapsed ? 105 : 120,
    easing: Easing.out(Easing.quad),
    useNativeDriver: false,
  }).start();
}

export function resetHeader() {
  resetScrollTracking(0);
  isCollapsed = false;
  headerCollapseProgress.stopAnimation();
  headerCollapseProgress.setValue(0);
}

export function useCollapsibleHeaderScreen(options: CollapsibleHeaderScreenOptions = {}) {
  const {
    resetOnFocus = true,
    scrollEpsilon = SCROLL_EPSILON,
    collapseAfterY = COLLAPSE_AFTER_Y,
    collapseTravel = COLLAPSE_TRAVEL,
    expandTravel = EXPAND_TRAVEL,
  } = options;
  const hasScrolledSinceFocusRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      hasScrolledSinceFocusRef.current = false;
      if (resetOnFocus) resetHeader();
      else resetScrollTracking(0);
    }, [resetOnFocus]),
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);

    if (offsetY <= scrollEpsilon) {
      resetScrollTracking(0);
      if (resetOnFocus || hasScrolledSinceFocusRef.current) animateHeader(false);
      return;
    }

    hasScrolledSinceFocusRef.current = true;
    const delta = offsetY - lastScrollY;
    if (Math.abs(delta) < scrollEpsilon) return;

    const direction: -1 | 1 = delta > 0 ? 1 : -1;
    if (direction !== lastDirection) {
      directionalTravel = 0;
      lastDirection = direction;
    }
    directionalTravel += Math.abs(delta);
    lastScrollY = offsetY;

    if (direction > 0 && offsetY >= collapseAfterY && directionalTravel >= collapseTravel) {
      directionalTravel = 0;
      animateHeader(true);
      return;
    }

    if (direction < 0 && directionalTravel >= expandTravel) {
      directionalTravel = 0;
      animateHeader(false);
    }
  }, [collapseAfterY, collapseTravel, expandTravel, resetOnFocus, scrollEpsilon]);

  return {
    onScroll,
    resetHeader,
    headerCollapseProgress,
  };
}
