import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { authKeys } from "./query-keys";
import { endSession, getSessionState, storeSession } from "./session";
import { getLoginPushFields } from "@/src/features/notifications/registration";
import type { LoginInput, RegisterInput, ResetPasswordInput, VerifyAccountInput } from "./types";
const authSessionQueryOptions = {
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
} as const;

export function useAuthStatus() {
  const { data, isLoading } = useQuery({
    queryKey: authKeys.session(),
    queryFn: getSessionState,
    ...authSessionQueryOptions,
  });

  return {
    isLoading,
    isAuthenticated: data?.isAuthenticated ?? false,
    user: data?.user ?? null,
  };
}
export function useLogin() { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (input: LoginInput) => { const pushFields = await getLoginPushFields(); const session = await authApi.login({ ...input, ...pushFields }); await storeSession(session); return session; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }) }); }
export function useRegister() { return useMutation({ mutationFn: (input: RegisterInput) => authApi.register(input) }); }
export function useVerifyAccount() { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (input: VerifyAccountInput) => { const session = await authApi.verifyAccount(input); await storeSession(session); return session; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }) }); }
export function useResendAccountVerification() { return useMutation({ mutationFn: (login: string) => authApi.resendVerification(login) }); }
export function useLogout() { const queryClient = useQueryClient(); return useMutation({ mutationFn: endSession, onSuccess: () => { queryClient.clear(); queryClient.invalidateQueries({ queryKey: authKeys.session() }); } }); }
export function useForgotPassword() { return useMutation({ mutationFn: (login: string) => authApi.forgotPassword(login) }); }
export function useVerifyResetCode() { return useMutation({ mutationFn: ({ login, code }: { login: string; code: string }) => authApi.verifyResetCode(login, code) }); }
export function useResetPassword() { return useMutation({ mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input) }); }
export function useUpdateAvatar() { const queryClient = useQueryClient(); return useMutation({ mutationFn: authApi.updateAvatar, onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }) }); }
export function useRemoveAvatar() { const queryClient = useQueryClient(); return useMutation({ mutationFn: authApi.removeAvatar, onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }) }); }
