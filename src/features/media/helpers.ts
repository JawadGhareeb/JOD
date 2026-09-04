import { getApiRootUrl } from "@/src/lib/env";
import type { PublicMediaItem } from "./types";

const MOBILE_API_PATH = "/api/mobile/";

function normalizeMobileEndpointUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const apiRoot = getApiRootUrl().replace(/\/+$/, "");

  if (value.startsWith(MOBILE_API_PATH)) {
    return `${apiRoot}${value}`;
  }

  try {
    const parsed = new URL(value);
    if (!parsed.pathname.startsWith(MOBILE_API_PATH)) return value;
    return `${apiRoot}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return value;
  }
}

export function normalizePublicMediaItem(item: PublicMediaItem): PublicMediaItem {
  return {
    ...item,
    streamUrl: normalizeMobileEndpointUrl(item.streamUrl) ?? item.streamUrl,
    previewUrl: normalizeMobileEndpointUrl(item.previewUrl),
  };
}

export function getReelPlaybackUrl(item: PublicMediaItem): string {
  return item.streamUrl || item.previewUrl || item.url;
}

export function getReelPreviewPlaybackUrl(item: PublicMediaItem): string {
  return item.previewUrl || item.streamUrl || item.url;
}
