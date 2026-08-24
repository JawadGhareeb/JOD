import AsyncStorage from "@react-native-async-storage/async-storage";
const KEYS = { deviceId: "jod-notifications-device-id", registrationId: "jod-notifications-registration-id", fcmToken: "jod-notifications-fcm-token" } as const;
function createDeviceId() { return `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`; }
export const notificationStorageService = {
  async ensureDeviceId() { try { const current = await AsyncStorage.getItem(KEYS.deviceId); if (current) return current; const id = createDeviceId(); await AsyncStorage.setItem(KEYS.deviceId, id); return id; } catch { return createDeviceId(); } },
  async setRegistration(id: string, token: string) { try { await AsyncStorage.multiSet([[KEYS.registrationId, id], [KEYS.fcmToken, token]]); } catch {} },
  async getRegistrationId() { try { return await AsyncStorage.getItem(KEYS.registrationId); } catch { return null; } },
  async getFcmToken() { try { return await AsyncStorage.getItem(KEYS.fcmToken); } catch { return null; } },
  async clearRegistration() { try { await AsyncStorage.multiRemove([KEYS.registrationId, KEYS.fcmToken]); } catch {} },
};
