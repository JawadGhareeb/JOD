import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStatus } from "@/src/features/auth/queries";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(isAuthenticated ? "/(tabs)/home" : "/(auth)/login");
  }, [isAuthenticated, isLoading, router]);

  return null;
}
