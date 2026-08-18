import { getSessionState, type AuthUser } from "@/src/lib/auth";
import { useCallback, useEffect, useState } from "react";

export const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await getSessionState();
      setIsAuthenticated(session.isAuthenticated);
      setUser(session.user);
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
