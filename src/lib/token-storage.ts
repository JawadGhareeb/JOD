import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jod_access_token";

/**
 * Unlike the web app's in-memory-only access token (re-acquired from an
 * HttpOnly refresh cookie on reload), this contract has no refresh endpoint
 * and a mobile app has no cookie jar — the token has to be persisted, or the
 * user is logged out every time the app restarts. SecureStore (Keychain /
 * Keystore) is used instead of AsyncStorage since this is a real credential.
 */
let cachedToken: string | null | undefined;

export async function getStoredToken(): Promise<string | null> {
  if (cachedToken !== undefined) {
    return cachedToken;
  }

  cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return cachedToken;
}

export async function setStoredToken(token: string | null): Promise<void> {
  cachedToken = token;

  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
