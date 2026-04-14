import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthStatus = useCallback(async () => {
    setIsLoading(true);
    setIsAuthenticated(false);
    setIsLoading(false);
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
