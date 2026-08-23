const DEFAULT_API_BASE_URL = "https://jod.mustafafares.com/api/mobile";
const MOBILE_API_SUFFIX = "/api/mobile";

/**
 * Expo inlines `EXPO_PUBLIC_`-prefixed vars at build time, so — unlike a web
 * app that can fetch a fresh config.json post-deploy — changing this after
 * the app is built means shipping a new build (or an EAS Update), not
 * editing a server-side file. Set it in `.env` / `.env.local` per environment.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  return configured || DEFAULT_API_BASE_URL;
}

export function getApiRootUrl(): string {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
  return baseUrl.endsWith(MOBILE_API_SUFFIX)
    ? baseUrl.slice(0, -MOBILE_API_SUFFIX.length)
    : baseUrl;
}
