import type { Campaign, HomePost, Publisher } from "@/src/features/posts/types";
import type { PublicMediaItem } from "@/src/features/media/types";

/** API-facing target discriminator. Never a Laravel class name. */
export type FollowTargetType = "user" | "organization";
export type FollowingFilter = "all" | FollowTargetType;

/** Returned by PUT/DELETE /publishers/{targetType}/{targetId}/follow. */
export interface FollowState {
  targetType: FollowTargetType;
  targetId: string;
  isFollowing: boolean;
  followersCount: number;
}

/** My Following items reuse the publisher shape. */
export type FollowedPublisher = Publisher & {
  followersCount: number;
  isFollowing: boolean;
};

export interface MyFollowingParams {
  type?: FollowingFilter;
  page?: number;
  perPage?: number;
}

export type FollowingFeedContentType = "post" | "campaign" | "video";

/**
 * Typed wrapper from GET /discovery/following. `content` reuses the existing
 * resource contract for each content type, so the app can hand it straight to
 * the cards it already renders elsewhere.
 */
export type FollowingFeedItem =
  | { contentType: "post"; publishedAt: string | null; content: HomePost }
  | { contentType: "campaign"; publishedAt: string | null; content: Campaign }
  | { contentType: "video"; publishedAt: string | null; content: PublicMediaItem };

export interface FollowingFeedParams {
  page?: number;
  perPage?: number;
}
