import { HomePostTypeEnum } from "@/src/constants/global";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import type { HomePost } from "@/src/types/home";

export function formatHomePostRelativeDate(isoDate: string): string {
  return formatRelativeDateAr(isoDate);
}

export const HOME_POST_TYPE_LABELS: Record<HomePostTypeEnum, string> = {
  [HomePostTypeEnum.VolunteerOpportunity]: "فرصة تطوع",
  [HomePostTypeEnum.DonationCampaign]: "حملة تبرع",
  [HomePostTypeEnum.HelpRequest]: "طلب مساعدة",
  [HomePostTypeEnum.CampaignUpdate]: "تحديث حملة",
  [HomePostTypeEnum.Awareness]: "توعوي",
};

const DEFAULT_PUBLIC_BASE_URI = "https://jod.app";
const SHARE_CONTENT_MAX_LENGTH = 140;

function trimTrailingSlash(uri: string): string {
  return uri.replace(/\/+$/, "");
}

function getShareContentPreview(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= SHARE_CONTENT_MAX_LENGTH) return normalized;
  return `${normalized.slice(0, SHARE_CONTENT_MAX_LENGTH).trimEnd()}...`;
}

export function buildHomePostShareLink(postId: string): string {
  const baseUri = process.env.EXPO_PUBLIC_BASE_URI?.trim();
  const normalizedBaseUri = trimTrailingSlash(baseUri || DEFAULT_PUBLIC_BASE_URI);
  return `${normalizedBaseUri}/posts/${postId}`;
}

export function buildHomePostShareMessage(post: HomePost): string {
  const postTypeLabel = HOME_POST_TYPE_LABELS[post.postType];
  const preview = getShareContentPreview(post.content);
  const postLink = buildHomePostShareLink(post.id);

  return [
    `منشور من ${post.publisher.name} على منصة جود`,
    `التصنيف: ${postTypeLabel}`,
    preview,
    `رابط المنشور: ${postLink}`,
    "#جود #عمل_إنساني",
  ].join("\n\n");
}
