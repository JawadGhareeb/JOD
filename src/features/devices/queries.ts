import { useMutation } from "@tanstack/react-query";
import { devicesApi } from "./api";
import type { MobileDeviceInput } from "./types";

export function useRegisterMobileDevice() {
  return useMutation({
    mutationFn: (input: MobileDeviceInput) => devicesApi.upsert(input),
  });
}

export function useUnregisterMobileDevice() {
  return useMutation({
    mutationFn: (deviceId: string) => devicesApi.remove(deviceId),
  });
}
