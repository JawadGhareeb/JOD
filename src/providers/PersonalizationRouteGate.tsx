import { useEffect, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useAuthStatus } from "@/src/features/auth/queries";
import { usePersonalizationProfile } from "@/src/features/personalization/queries";

const EXEMPT_PATHS = new Set([
  "/personalization",
  "/login",
  "/register",
  "/verify-account",
  "/forgot-password",
  "/reset-password",
]);

export function PersonalizationRouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const profileQuery = usePersonalizationProfile(isAuthenticated);
  const isExempt = EXEMPT_PATHS.has(pathname);

  useEffect(() => {
    if (authLoading || !isAuthenticated || isExempt || profileQuery.isLoading || !profileQuery.data) return;
    if (!profileQuery.data.onboardingCompleted) router.replace("/personalization");
  }, [authLoading, isAuthenticated, isExempt, profileQuery.data, profileQuery.isLoading, router]);

  if (authLoading || (isAuthenticated && !isExempt && profileQuery.isLoading)) {
    return <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-300"><ActivityIndicator size="large" /></View>;
  }

  if (isAuthenticated && !isExempt && profileQuery.data && !profileQuery.data.onboardingCompleted) return null;

  return children;
}
