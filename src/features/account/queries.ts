import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/src/features/auth/query-keys";
import { accountApi } from "./api";
import type { ChangePasswordInput, UpdateProfileInput } from "./types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => accountApi.updateProfile(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  });
}

export function useRequestPasswordChangeCode() {
  return useMutation({ mutationFn: (currentPassword: string) => accountApi.requestPasswordChangeCode(currentPassword) });
}

export function useChangePassword() {
  return useMutation({ mutationFn: (input: ChangePasswordInput) => accountApi.changePassword(input) });
}
