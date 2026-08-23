import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "jod_access_token";
const REFRESH_TOKEN_KEY = "jod_refresh_token";
const useSecureStore = Platform.OS !== "web";

export interface StoredTokenPair {
  token: string;
  refreshToken: string;
}

let cachedAccessToken: string | null | undefined;
let cachedRefreshToken: string | null | undefined;

async function readValue(key: string): Promise<string | null> {
  return useSecureStore ? SecureStore.getItemAsync(key) : AsyncStorage.getItem(key);
}

async function writeValue(key: string, value: string): Promise<void> {
  if (useSecureStore) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

async function removeValue(key: string): Promise<void> {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}

export async function getStoredToken(): Promise<string | null> {
  if (cachedAccessToken === undefined) cachedAccessToken = await readValue(ACCESS_TOKEN_KEY);
  return cachedAccessToken;
}

export async function getStoredRefreshToken(): Promise<string | null> {
  if (cachedRefreshToken === undefined) cachedRefreshToken = await readValue(REFRESH_TOKEN_KEY);
  return cachedRefreshToken;
}

export async function getStoredTokens(): Promise<{ token: string | null; refreshToken: string | null }> {
  const [token, refreshToken] = await Promise.all([getStoredToken(), getStoredRefreshToken()]);
  return { token, refreshToken };
}

export async function setStoredTokens(pair: StoredTokenPair): Promise<void> {
  cachedAccessToken = pair.token;
  cachedRefreshToken = pair.refreshToken;
  await Promise.all([
    writeValue(ACCESS_TOKEN_KEY, pair.token),
    writeValue(REFRESH_TOKEN_KEY, pair.refreshToken),
  ]);
}

/** Kept for small call sites that only replace/clear the access token. */
export async function setStoredToken(token: string | null): Promise<void> {
  cachedAccessToken = token;
  if (token) await writeValue(ACCESS_TOKEN_KEY, token);
  else await removeValue(ACCESS_TOKEN_KEY);
}

export async function clearStoredTokens(): Promise<void> {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  await Promise.all([removeValue(ACCESS_TOKEN_KEY), removeValue(REFRESH_TOKEN_KEY)]);
}
