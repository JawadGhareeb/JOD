import type { Href } from "expo-router";
import type { MobileNotification } from "./types";

function readString(
  payload: Record<string, unknown> | null | undefined,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = payload?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function idRoute(path: string, pattern: RegExp, pathname: string): Href | null {
  const match = path.match(pattern);
  if (!match?.[1]) return null;
  return { pathname: pathname as never, params: { id: decodeURIComponent(match[1]) } } as Href;
}

export function normalizeJodReferencePath(
  path: string | null | undefined,
): Href | null {
  if (!path) return null;

  const helpOffer = idRoute(path, /^\/help-offers\/([^/]+)$/, "/help-offers/[id]");
  if (helpOffer) return helpOffer;

  const post = idRoute(path, /^\/posts\/([^/]+)$/, "/posts/[id]");
  if (post) return post;

  const ownPostMatch = path.match(/^\/(?:my-posts|me\/posts)\/([^/]+)$/);
  if (ownPostMatch?.[1]) {
    return {
      pathname: "/(tabs)/create-post",
      params: { mode: "edit", postId: decodeURIComponent(ownPostMatch[1]) },
    } as Href;
  }

  const campaign = idRoute(path, /^\/campaigns\/([^/]+)$/, "/campaigns/[id]");
  if (campaign) return campaign;

  const application = idRoute(path, /^\/(?:applications|me\/applications)\/([^/]+)$/, "/applications/[id]");
  if (application) return application;

  const donation =
    idRoute(path, /^\/donations\/([^/]+)$/, "/donations/[id]") ??
    idRoute(path, /^\/me\/donations\/([^/]+)$/, "/donations/[id]");
  if (donation) return donation;

  const notification =
    idRoute(path, /^\/notifications\/([^/]+)$/, "/notifications/[id]") ??
    idRoute(path, /^\/me\/notifications\/([^/]+)$/, "/notifications/[id]");
  if (notification) return notification;

  if (path === "/help-offers") return "/help-offers" as Href;
  if (path === "/my-donations" || path === "/me/donations") return "/my-donations";
  if (path === "/my-applications" || path === "/applications" || path === "/me/applications") return "/my-applications";
  if (path === "/notifications" || path === "/me/notifications") return "/notifications";

  return null;
}

export function notificationTargetFromPayload(
  payload: Record<string, unknown> | null | undefined,
): Href | null {
  const referencePath = readString(
    payload,
    "referencePath",
    "reference_path",
    "path",
    "route",
  );
  const normalized = normalizeJodReferencePath(referencePath);
  if (normalized) return normalized;

  const offerId = readString(
    payload,
    "helpOfferId",
    "help_offer_id",
    "offerId",
    "offer_id",
  );
  if (offerId) {
    return { pathname: "/help-offers/[id]", params: { id: offerId } };
  }

  const applicationId = readString(payload, "applicationId", "application_id", "applicantId", "applicant_id");
  if (applicationId) {
    return { pathname: "/applications/[id]", params: { id: applicationId } };
  }

  const donationId = readString(payload, "donationId", "donation_id");
  if (donationId) {
    return { pathname: "/donations/[id]", params: { id: donationId } };
  }

  const campaignId = readString(payload, "campaignId", "campaign_id");
  if (campaignId) {
    return { pathname: "/campaigns/[id]", params: { id: campaignId } };
  }

  const postId = readString(payload, "postId", "post_id");
  if (postId) {
    return { pathname: "/posts/[id]", params: { id: postId } };
  }

  const notificationId = readString(
    payload,
    "notificationId",
    "notification_id",
  );
  if (notificationId) {
    return { pathname: "/notifications/[id]", params: { id: notificationId } };
  }

  return "/notifications";
}

export function notificationReferenceTarget(item: MobileNotification) {
  return normalizeJodReferencePath(item.referencePath ?? item.action?.route ?? null);
}

export function notificationTarget(item: MobileNotification): Href {
  return (
    notificationReferenceTarget(item) ?? {
      pathname: "/notifications/[id]",
      params: { id: item.id },
    }
  );
}
