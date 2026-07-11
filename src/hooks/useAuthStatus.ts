import { getMockAuth, type MockAuthUser } from "@/src/lib/auth";
import { useCallback, useEffect, useState } from "react";

export const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<MockAuthUser | null>(null);

  const refreshAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const authState = await getMockAuth();
      setIsAuthenticated(authState.isAuthenticated);
      setUser(authState.user ?? null);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAuthStatus();
  }, [refreshAuthStatus]);

  return {
    isLoading,
    isAuthenticated,
    user,
    refreshAuthStatus,
  };
};
