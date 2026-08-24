import { clearStoredTokens, getStoredToken, setStoredTokens } from "@/src/lib/token-storage";
import { unregisterCurrentDevice } from "@/src/features/notifications/registration";
import { authApi } from "./api";
import type { AuthSession, SessionState } from "./types";
const signedOutState: SessionState = { isAuthenticated: false, user: null };
export async function getSessionState(): Promise<SessionState> { const token = await getStoredToken(); if (!token) return signedOutState; try { const user = await authApi.me(); return { isAuthenticated: true, user }; } catch { return signedOutState; } }
export async function storeSession(session: AuthSession): Promise<void> { await setStoredTokens({ token: session.token, refreshToken: session.refreshToken }); }
export async function endSession(): Promise<void> { const token = await getStoredToken(); if (token) { try { await unregisterCurrentDevice(); } catch {} try { await authApi.logout(); } catch {} } await clearStoredTokens(); }
