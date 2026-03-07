import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getAuthToken } from "@/utils/auth";

export const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = await getAuthToken();
      setIsAuthenticated(Boolean(token));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshAuthStatus();
    }, [refreshAuthStatus]),
  );

  return {
    isLoading,
    isAuthenticated,
    refreshAuthStatus,
  };
};
