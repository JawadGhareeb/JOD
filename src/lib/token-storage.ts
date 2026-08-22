import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "jod_access_token";

/**
 * Unlike the web app's in-memory-only access token (re-acquired from an
 * HttpOnly refresh cookie on reload), this contract has no refresh endpoint
 * and a mobile app has no cookie jar — the token has to be persisted, or the
 * user is logged out every time the app restarts.
 *
 * Native: SecureStore (Keychain / Keystore).
 * Web: AsyncStorage — SecureStore is iOS/Android only, so register/login was
 * succeeding on the API then throwing when persisting the token.
 */
let cachedToken: string | null | undefined;

const useSecureStore = Platform.OS !== "web";

async function readToken(): Promise<string | null> {
  if (useSecureStore) {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function writeToken(token: string): Promise<void> {
  if (useSecureStore) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    return;
  }
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function clearToken(): Promise<void> {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return;
  }
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getStoredToken(): Promise<string | null> {
  if (cachedToken !== undefined) {
    return cachedToken;
  }

  cachedToken = await readToken();
  return cachedToken;
}

export async function setStoredToken(token: string | null): Promise<void> {
  cachedToken = token;

  if (token) {
    await writeToken(token);
  } else {
    await clearToken();
  }
}
