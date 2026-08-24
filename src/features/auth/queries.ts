import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { authKeys } from "./query-keys";
import { endSession, getSessionState, storeSession } from "./session";
import { getLoginPushFields } from "@/src/features/notifications/registration";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "./types";
export function useAuthStatus() { const { data, isLoading, refetch } = useQuery({ queryKey: authKeys.session(), queryFn: getSessionState }); return { isLoading, isAuthenticated: data?.isAuthenticated ?? false, user: data?.user ?? null, refreshAuthStatus: refetch }; }
export function useLogin() { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (input: LoginInput) => { const pushFields = await getLoginPushFields(); const session = await authApi.login({ ...input, ...pushFields }); await storeSession(session); return session; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }) }); }
export function useRegister() { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (input: RegisterInput) => { const session = await authApi.register(input); await storeSession(session); return session; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }) }); }
export function useLogout() { const queryClient = useQueryClient(); return useMutation({ mutationFn: endSession, onSuccess: () => { queryClient.clear(); queryClient.invalidateQueries({ queryKey: authKeys.session() }); } }); }
export function useForgotPassword() { return useMutation({ mutationFn: (login: string) => authApi.forgotPassword(login) }); }
export function useVerifyResetCode() { return useMutation({ mutationFn: ({ login, code }: { login: string; code: string }) => authApi.verifyResetCode(login, code) }); }
export function useResetPassword() { return useMutation({ mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input) }); }
