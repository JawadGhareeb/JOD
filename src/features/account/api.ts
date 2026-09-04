import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type { AuthUser } from "@/src/features/auth/types";
import type { ChangePasswordInput, PasswordChangeVerificationPayload, UpdateProfileInput } from "./types";

const ENDPOINTS = {
  profile: "/me/profile",
  changePassword: "/me/change-password",
  changePasswordCode: "/me/change-password/code",
  permissions: "/me/permissions",
} as const;

export const accountApi = {
  updateProfile: async (input: UpdateProfileInput): Promise<AuthUser> => {
    const response = await apiClient.patch<ApiEnvelope<AuthUser>>(ENDPOINTS.profile, input);
    return response.data.data;
  },

  requestPasswordChangeCode: async (currentPassword: string): Promise<PasswordChangeVerificationPayload> => {
    const response = await apiClient.post<ApiEnvelope<PasswordChangeVerificationPayload>>(
      ENDPOINTS.changePasswordCode,
      { currentPassword },
    );
    return response.data.data;
  },

  changePassword: async (input: ChangePasswordInput): Promise<boolean> => {
    const response = await apiClient.patch<ApiEnvelope<{ passwordChanged: boolean }>>(
      ENDPOINTS.changePassword,
      input,
    );
    return response.data.data.passwordChanged;
  },

  getPermissions: async (): Promise<unknown[]> => {
    const response = await apiClient.get<ApiEnvelope<unknown[]>>(ENDPOINTS.permissions);
    return response.data.data;
  },
};
