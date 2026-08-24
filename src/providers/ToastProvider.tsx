import { CircleCheck, CircleX, Info, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/src/components/ui/Text";

export type ToastType = "success" | "error" | "info";

type ToastPayload = {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
};

type ToastContextValue = {
  showToast: (payload: ToastPayload) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: "تمت العملية بنجاح",
  error: "تعذر إكمال العملية",
  info: "للعلم",
};

const ACCENTS: Record<ToastType, string> = {
  success: "#16A34A",
  error: "#DC2626",
  info: "#405d72",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearTimer();
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -12, duration: 150, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [clearTimer, opacity, translateY]);

  const showToast = useCallback(
    (payload: ToastPayload) => {
      clearTimer();
      setToast(payload);
      opacity.setValue(0);
      translateY.setValue(-12);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 90,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(hideToast, payload.duration ?? 3200);
    },
    [clearTimer, hideToast, opacity, translateY],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (message, title) => showToast({ type: "success", message, title }),
      error: (message, title) => showToast({ type: "error", message, title }),
      info: (message, title) => showToast({ type: "info", message, title }),
      hideToast,
    }),
    [hideToast, showToast],
  );

  const Icon = toast?.type === "success" ? CircleCheck : toast?.type === "error" ? CircleX : Info;
  const accent = toast ? ACCENTS[toast.type] : ACCENTS.info;

  return (
    <ToastContext.Provider value={value}>
      <View className="flex-1">
        {children}
        {toast ? (
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              top: Math.max(insets.top, 8) + 8,
              left: 14,
              right: 14,
              zIndex: 9999,
              elevation: 9999,
            }}
          >
            <Animated.View
              style={{
                opacity,
                transform: [{ translateY }],
                borderColor: accent,
                backgroundColor: isDark ? "#2E2F3A" : "#FFFFFF",
              }}
              className="flex-row-reverse items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg"
            >
              <View
                style={{ backgroundColor: `${accent}18` }}
                className="h-10 w-10 items-center justify-center rounded-xl"
              >
                <Icon size={20} color={accent} strokeWidth={2.4} />
              </View>
              <View className="flex-1">
                <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                  {toast.title || DEFAULT_TITLES[toast.type]}
                </Text>
                <Text size="xs" className="mt-1 leading-5 text-gray-500 dark:text-gray-300">
                  {toast.message}
                </Text>
              </View>
              <Pressable
                onPress={hideToast}
                className="h-8 w-8 items-center justify-center rounded-lg"
                accessibilityRole="button"
                accessibilityLabel="إغلاق الإشعار"
              >
                <X size={16} color={isDark ? "#D1D5DB" : "#6B7280"} strokeWidth={2.25} />
              </Pressable>
            </Animated.View>
          </View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
