import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStatus } from "@/src/features/auth/queries";

const PROTECTED_EXACT_PATHS = new Set([
  "/profile",
  "/notifications",
  "/create-post",
  "/post",
  "/help-offers",
  "/account-settings",
  "/change-password",
  "/edit-information",
  "/my-applications",
  "/my-donations",
  "/saved-posts",
]);
const PROTECTED_PREFIXES = ["/applications/", "/apply/", "/donate/", "/donations/", "/help-offers/", "/notifications/"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_EXACT_PATHS.has(pathname) || PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function ProtectedRouteBridge() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    if (isLoading || isAuthenticated || !isProtectedPath(pathname)) return;
    router.replace("/(auth)/login");
  }, [isAuthenticated, isLoading, pathname, router]);

  return null;
}
