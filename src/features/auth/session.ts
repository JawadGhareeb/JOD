import { getStoredToken, setStoredToken } from "@/src/lib/token-storage";
import { authApi } from "./api";
import type { SessionState } from "./types";

const signedOutState: SessionState = {
  isAuthenticated: false,
  user: null,
};

/**
 * A stored token alone doesn't prove the session is still valid — it could
 * be expired or revoked server-side — so this calls `/me` to confirm it
 * rather than trusting local storage on its own.
 */
export async function getSessionState(): Promise<SessionState> {
  const token = await getStoredToken();
  if (!token) {
    return signedOutState;
  }

  try {
    const user = await authApi.me();
    return { isAuthenticated: true, user };
  } catch {
    // Invalid/expired token — api-client's 401 handler already cleared it
    // on an auth failure; this also covers e.g. a network error defensively.
    return signedOutState;
  }
}

/** Persists the session after a successful register/login response. */
export async function storeSession(token: string): Promise<void> {
  await setStoredToken(token);
}

/** Best-effort server-side logout — the local session is cleared either way. */
export async function endSession(): Promise<void> {
  const token = await getStoredToken();

  // Logout requires a Bearer token. If we never persisted one (e.g. web
  // SecureStore failure before the AsyncStorage fallback), calling the API
  // only produces a useless 401 — skip it and clear local state.
  if (token) {
    try {
      await authApi.logout();
    } catch {
      // Local session is the source of truth for the client regardless.
    }
  }

  await setStoredToken(null);
}
