import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useFocusEffect } from "expo-router";
import { type LayoutChangeEvent } from "react-native";
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

type CollapsibleHeaderContextValue = {
  headerHeight: SharedValue<number>;
  hiddenAmount: SharedValue<number>;
  lastScrollY: SharedValue<number>;
  registerHeaderHeight: (height: number) => void;
  resetHeader: () => void;
};

const CollapsibleHeaderContext = createContext<CollapsibleHeaderContextValue | null>(null);

const SCROLL_EPSILON = 2;

export function CollapsibleHeaderProvider({ children }: { children: ReactNode }) {
  const headerHeight = useSharedValue(0);
  const hiddenAmount = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const registerHeaderHeight = useCallback(
    (height: number) => {
      if (height <= 0 || height === headerHeight.value) return;
      headerHeight.value = height;
      hiddenAmount.value = Math.min(hiddenAmount.value, height);
    },
    [headerHeight, hiddenAmount],
  );

  const resetHeader = useCallback(() => {
    hiddenAmount.value = 0;
  }, [hiddenAmount]);

  return (
    <CollapsibleHeaderContext.Provider
      value={{
        headerHeight,
        hiddenAmount,
        lastScrollY,
        registerHeaderHeight,
        resetHeader,
      }}
    >
      {children}
    </CollapsibleHeaderContext.Provider>
  );
}

export function useCollapsibleHeaderState() {
  const context = useContext(CollapsibleHeaderContext);

  if (!context) {
    throw new Error("useCollapsibleHeaderScreen must be used within CollapsibleHeaderProvider");
  }

  return context;
}

export function useCollapsibleHeaderScreen() {
  const { headerHeight, hiddenAmount, lastScrollY, registerHeaderHeight, resetHeader } =
    useCollapsibleHeaderState();

  useFocusEffect(
    useCallback(() => {
      resetHeader();
    }, [resetHeader]),
  );

  const onHeaderLayout = useCallback(
    (event: LayoutChangeEvent) => {
      registerHeaderHeight(Math.ceil(event.nativeEvent.layout.height));
    },
    [registerHeaderHeight],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      const delta = offsetY - lastScrollY.value;
      lastScrollY.value = offsetY;

      if (offsetY <= 0) {
        hiddenAmount.value = 0;
        return;
      }

      if (Math.abs(delta) < SCROLL_EPSILON) {
        return;
      }

      const nextHiddenAmount = hiddenAmount.value + delta;
      const maxHiddenAmount = headerHeight.value;
      hiddenAmount.value = Math.max(0, Math.min(nextHiddenAmount, maxHiddenAmount));
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -hiddenAmount.value }],
    }),
  );

  const contentAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -hiddenAmount.value }],
    }),
  );

  return {
    headerAnimatedStyle,
    contentAnimatedStyle,
    onHeaderLayout,
    onScroll,
    resetHeader,
  };
}
