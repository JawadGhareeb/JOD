export interface MobileDeviceInput { pushToken: string; pushTargetType?: "token" | "fid"; platform: "ios" | "android"; deviceId?: string | null; appVersion?: string | null }
export interface MobileDevice { id: string; pushTargetType: string; platform: string; deviceId: string | null; appVersion: string | null; lastSeenAt: string | null; createdAt: string | null; updatedAt: string | null }
