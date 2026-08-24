export interface AuthUserStats { postsCount: number; savedCount: number; donationsCount: number }
export interface AuthOrganization { id: string; name: string; email: string | null; phone: string | null; city: string | null; bio: string | null; status: string | null; verificationStatus: string | null }
export interface AuthUser { id: string; name: string; username: string; email: string; phone: string | null; city: string | null; bio: string | null; avatarUrl: string | null; verified: boolean; userType: string | null; status: string | null; organizationId: string | null; organization: AuthOrganization | null; stats: AuthUserStats; createdAt: string | null; lastActiveAt: string | null }
export interface TokenPayload { token: string; refreshToken: string; tokenType: string; expiresIn: number; refreshExpiresIn: number; expiresAt: string; refreshExpiresAt: string }
export interface AuthSession extends TokenPayload { user: AuthUser }
export type RefreshedTokenPayload = TokenPayload;
export interface RegisterInput { name: string; email: string; phone: string; password: string; password_confirmation: string }
export interface LoginInput { email?: string | null; phone?: string | null; password: string; fcmToken?: string; fcmPlatform?: "ios" | "android"; deviceId?: string; appVersion?: string | null }
export interface ResetPasswordInput { login: string; code: string; password: string; password_confirmation: string }
export interface SessionState { isAuthenticated: boolean; user: AuthUser | null }
