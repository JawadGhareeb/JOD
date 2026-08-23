import type { GetDiscoveryPostsParams, GetMyPostsParams, GetSavedPostsParams } from "./types";

export const postKeys = {
  all: ["posts"] as const,
  feeds: () => [...postKeys.all, "discovery"] as const,
  feed: (params: GetDiscoveryPostsParams = {}) => [...postKeys.feeds(), params] as const,
  detail: (postId?: string) => [...postKeys.all, "detail", postId] as const,
  mineLists: () => [...postKeys.all, "mine"] as const,
  mine: (params: GetMyPostsParams = {}) => [...postKeys.mineLists(), params] as const,
  myDetail: (postId?: string) => [...postKeys.mineLists(), "detail", postId] as const,
  savedLists: () => [...postKeys.all, "saved"] as const,
  saved: (params: GetSavedPostsParams = {}) => [...postKeys.savedLists(), params] as const,
  publisher: (id?: string) => ["publisher", id] as const,
  publisherPosts: (id?: string, params: GetDiscoveryPostsParams = {}) => ["publisher", id, "posts", params] as const,
  campaigns: () => ["campaigns"] as const,
  campaignList: (params: Record<string, unknown> = {}) => [...postKeys.campaigns(), params] as const,
  campaign: (campaignId?: string | null) => ["campaign", campaignId] as const,
  categories: (params: Record<string, unknown> = {}) => ["categories", params] as const,
};

export const postsKeys = {
  feed: () => postKeys.feeds(),
  detail: postKeys.detail,
  campaign: postKeys.campaign,
  byOrganization: (organizationId?: string) => postKeys.publisherPosts(organizationId),
  mine: () => postKeys.mineLists(),
  saved: () => postKeys.savedLists(),
};
