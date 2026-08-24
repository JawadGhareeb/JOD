import { useRouter } from "expo-router";
import { LogIn } from "lucide-react-native";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Dialog from "@/src/components/ui/Dialog";
import { useAuthStatus } from "@/src/features/auth/queries";

type AuthGuardContextValue = {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  requireAuth: () => boolean;
};

const AuthGuardContext = createContext<AuthGuardContextValue | null>(null);

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setVisible(false);
  }, [isAuthenticated]);

  const requireAuth = useCallback(() => {
    if (isAuthenticated) return true;
    setVisible(true);
    return false;
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({ isAuthenticated, isAuthLoading: isLoading, requireAuth }),
    [isAuthenticated, isLoading, requireAuth],
  );

  return (
    <AuthGuardContext.Provider value={value}>
      {children}
      <Dialog
        visible={visible}
        title="تسجيل الدخول مطلوب"
        message="يمكنك متابعة تصفح جود كزائر، لكن هذا الإجراء يحتاج إلى تسجيل الدخول أولاً."
        icon={<LogIn size={28} color="#405d72" strokeWidth={2.25} />}
        onClose={() => setVisible(false)}
        buttons={[
          {
            text: "لاحقاً",
            variant: "tertiary",
            onPress: () => setVisible(false),
          },
          {
            text: "تسجيل الدخول",
            variant: "primary",
            onPress: () => {
              setVisible(false);
              router.push("/(auth)/login");
            },
          },
        ]}
      />
    </AuthGuardContext.Provider>
  );
}

export function useAuthGuard() {
  const context = useContext(AuthGuardContext);
  if (!context) throw new Error("useAuthGuard must be used within AuthGuardProvider");
  return context;
}
