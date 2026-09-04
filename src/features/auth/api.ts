import { Platform } from "react-native";
import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type {
  AuthSession,
  AuthUser,
  LoginInput,
  RefreshedTokenPayload,
  RegisterInput,
  ResendVerificationPayload,
  ResetPasswordInput,
  VerificationPendingPayload,
  VerifyAccountInput,
} from "./types";

const ENDPOINTS = {
  register: "/auth/register",
  verifyAccount: "/auth/verify-account",
  resendVerification: "/auth/resend-verification",
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  forgotPassword: "/auth/forgot-password",
  verifyResetCode: "/auth/verify-reset-code",
  resetPassword: "/auth/reset-password",
  me: "/me",
  avatar: "/me/avatar",
} as const;

export const authApi = {
  register: async (input: RegisterInput): Promise<VerificationPendingPayload> => {
    const response = await apiClient.post<ApiEnvelope<VerificationPendingPayload>>(ENDPOINTS.register, input);
    return response.data.data;
  },
  verifyAccount: async (input: VerifyAccountInput): Promise<AuthSession> => {
    const response = await apiClient.post<ApiEnvelope<AuthSession>>(ENDPOINTS.verifyAccount, input);
    return response.data.data;
  },
  resendVerification: async (login: string): Promise<ResendVerificationPayload> => {
    const response = await apiClient.post<ApiEnvelope<ResendVerificationPayload>>(ENDPOINTS.resendVerification, { login });
    return response.data.data;
  },
  login: async (input: LoginInput): Promise<AuthSession> => {
    const response = await apiClient.post<ApiEnvelope<AuthSession>>(ENDPOINTS.login, input);
    return response.data.data;
  },
  refresh: async (refreshToken: string): Promise<RefreshedTokenPayload> => {
    const response = await apiClient.post<ApiEnvelope<RefreshedTokenPayload>>(ENDPOINTS.refresh, { refreshToken });
    return response.data.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.logout);
  },
  forgotPassword: async (login: string): Promise<boolean> => {
    const response = await apiClient.post<ApiEnvelope<{ resetCodeSent: boolean }>>(ENDPOINTS.forgotPassword, { login });
    return response.data.data.resetCodeSent;
  },
  verifyResetCode: async (login: string, code: string): Promise<boolean> => {
    const response = await apiClient.post<ApiEnvelope<{ resetCodeVerified: boolean }>>(ENDPOINTS.verifyResetCode, { login, code });
    return response.data.data.resetCodeVerified;
  },
  resetPassword: async (input: ResetPasswordInput): Promise<boolean> => {
    const response = await apiClient.post<ApiEnvelope<{ resetPasswordUpdated: boolean }>>(ENDPOINTS.resetPassword, input);
    return response.data.data.resetPasswordUpdated;
  },
  updateAvatar: async (image: { uri: string; name: string; type: string }): Promise<AuthUser> => {
    const form = new FormData();
    if (Platform.OS === "web") {
      const blob = await fetch(image.uri).then((response) => response.blob());
      form.append("file", blob, image.name);
    } else {
      form.append("file", image as unknown as Blob);
    }
    const response = await apiClient.post<ApiEnvelope<AuthUser>>(ENDPOINTS.avatar, form);
    return response.data.data;
  },
  removeAvatar: async (): Promise<AuthUser> => {
    const response = await apiClient.delete<ApiEnvelope<AuthUser>>(ENDPOINTS.avatar);
    return response.data.data;
  },
  me: async (): Promise<AuthUser> => {
    const response = await apiClient.get<ApiEnvelope<AuthUser>>(ENDPOINTS.me);
    return response.data.data;
  },
};
