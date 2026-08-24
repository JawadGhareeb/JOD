import Constants from "expo-constants";
import { Platform } from "react-native";
import { devicesApi } from "@/src/features/devices/api";
import { notificationRuntimeService } from "./services/notification-runtime.service";
import { notificationStorageService } from "./services/notification-storage.service";
export async function getLoginPushFields() { await notificationRuntimeService.configure(); const granted = await notificationRuntimeService.requestPermissions(); if (!granted) return {}; const fcmToken = await notificationRuntimeService.getFcmToken(); if (!fcmToken || (Platform.OS !== "ios" && Platform.OS !== "android")) return {}; return { fcmToken, fcmPlatform: Platform.OS as "ios" | "android", deviceId: await notificationStorageService.ensureDeviceId(), appVersion: Constants.expoConfig?.version ?? null }; }
export async function syncDeviceToken(pushToken: string) { if (Platform.OS !== "ios" && Platform.OS !== "android") return null; const device = await devicesApi.upsert({ pushToken, pushTargetType: "token", platform: Platform.OS, deviceId: await notificationStorageService.ensureDeviceId(), appVersion: Constants.expoConfig?.version ?? null }); await notificationStorageService.setRegistration(device.id, pushToken); return device; }
export async function unregisterCurrentDevice() { const registrationId = await notificationStorageService.getRegistrationId(); if (!registrationId) return; try { await devicesApi.remove(registrationId); } finally { await notificationStorageService.clearRegistration(); } }
