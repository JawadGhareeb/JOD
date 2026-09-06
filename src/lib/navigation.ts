import { useRouter } from "expo-router";

const DEFAULT_FALLBACK_ROUTE = "/(tabs)/home";

/**
 * router.back() is a no-op (or throws on some platforms) when the current
 * screen has no history to pop, e.g. opened from a deep link or notification.
 * This falls back to replacing with a safe route so the back arrow always works.
 */
export function useGoBack(fallbackRoute: string = DEFAULT_FALLBACK_ROUTE) {
  const router = useRouter();
  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as never);
    }
  };
}
