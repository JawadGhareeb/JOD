import { getMockAuth } from "@/src/lib/auth";
import { useCallback, useEffect, useState } from "react";

export const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const authState = await getMockAuth();
      setIsAuthenticated(authState.isAuthenticated);
    } catch {
      setIsAuthenticated(false);
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
    refreshAuthStatus,
  };
};
