export interface AuthUserStats {
  postsCount: number;
  savedCount: number;
  donationsCount: number;
}

/**
 * Shape returned by `GET /me` / auth session `user`.
 * OpenAPI lists the core fields; live responses also include username/city/bio/
 * verified/stats (seen on register/login) — keep those optional so both shapes type-check.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userType: string | null;
  status: string | null;
  organizationId: string | null;
  organization: unknown;
  createdAt: string | null;
  lastActiveAt: string | null;
  username?: string | null;
  city?: string | null;
  bio?: string | null;
  verified?: boolean;
  stats?: AuthUserStats | null;
}

export interface AuthSession {
  token: string;
  tokenType: string;
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

export interface ResetPasswordInput {
  login: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
