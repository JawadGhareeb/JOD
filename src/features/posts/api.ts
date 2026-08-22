import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type {
  ApiPostType,
  Campaign,
  Category,
  CreatePostType,
  GetCategoriesParams,
  GetDiscoveryCampaignsParams,
  GetDiscoveryPostsParams,
  GetMyPostsParams,
  GetSavedPostsParams,
  HomePost,
  LikeToggleResult,
  MyPost,
  PostInput,
  ReportPostResult,
  SavedPost,
  SaveToggleResult,
} from "./types";

// Maps the create-post UI's 3-way picker to the server's exact `type` enum,
// and back — the one place both directions are defined, so every screen
// that needs either direction agrees.
export const POST_TYPE_TO_API_TYPE: Record<CreatePostType, ApiPostType> = {
  volunteer: "volunteer_opportunity",
  donation: "donation_campaign",
  help: "help_request",
};

export const API_TYPE_TO_POST_TYPE: Record<ApiPostType, CreatePostType> = {
  volunteer_opportunity: "volunteer",
  donation_campaign: "donation",
  help_request: "help",
};

const ENDPOINTS = {
  discoveryPosts: "/discovery/posts",
  discoveryCampaigns: "/discovery/campaigns",
  discoveryCategories: "/discovery/categories",
  posts: "/posts",
  post: (postId: string) => `/posts/${postId}`,
  submit: (postId: string) => `/posts/${postId}/submit`,
  archive: (postId: string) => `/posts/${postId}/archive`,
  repost: (postId: string) => `/posts/${postId}/repost`,
  like: (postId: string) => `/posts/${postId}/like`,
  save: (postId: string) => `/posts/${postId}/save`,
  reports: (postId: string) => `/posts/${postId}/reports`,
  myPosts: "/me/posts",
  savedPosts: "/me/saved-posts",
} as const;

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, String(value));
  });

  const search = query.toString();
  return search ? `?${search}` : "";
}

export const postsApi = {
  // Discovery — public reads, power the home feed and detail screens.
  getFeed: async (
    params: GetDiscoveryPostsParams = {},
  ): Promise<{ items: HomePost[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiEnvelope<HomePost[]>>(
      `${ENDPOINTS.discoveryPosts}${buildQuery({ ...params })}`,
    );
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },

  getPost: async (postId: string): Promise<HomePost> => {
    const response = await apiClient.get<ApiEnvelope<HomePost>>(
      `${ENDPOINTS.discoveryPosts}/${postId}`,
    );
    return response.data.data;
  },

  getCampaigns: async (
    params: GetDiscoveryCampaignsParams = {},
  ): Promise<{ items: Campaign[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiEnvelope<Campaign[]>>(
      `${ENDPOINTS.discoveryCampaigns}${buildQuery({ ...params })}`,
    );
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },

  getCampaign: async (campaignId: string): Promise<Campaign> => {
    const response = await apiClient.get<ApiEnvelope<Campaign>>(
      `${ENDPOINTS.discoveryCampaigns}/${campaignId}`,
    );
    return response.data.data;
  },

  getCategories: async (
    params: GetCategoriesParams = {},
  ): Promise<{ items: Category[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiEnvelope<Category[]>>(
      `${ENDPOINTS.discoveryCategories}${buildQuery({ ...params })}`,
    );
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },

  // Own-post lifecycle (UserPost).
  getMyPosts: async (
    params: GetMyPostsParams = {},
  ): Promise<{ items: MyPost[]; meta: PaginationMeta }> => {
    const query = buildQuery({
      page: params.page,
      perPage: params.perPage,
      "filter[status]": params.status,
      sort: params.sort,
    });
    const response = await apiClient.get<ApiEnvelope<MyPost[]>>(`${ENDPOINTS.myPosts}${query}`);
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },

  /**
   * `PostRequest.images` is schema'd with `maxItems: 0` server-side — any
   * image array sent here is rejected. Don't send `images` at all until
   * that's confirmed fixed (separately from the read-side fix already
   * confirmed).
   */
  create: async (input: PostInput): Promise<MyPost> => {
    const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.posts, input);
    return response.data.data;
  },

  update: async (postId: string, input: PostInput): Promise<MyPost> => {
    const response = await apiClient.patch<ApiEnvelope<MyPost>>(ENDPOINTS.post(postId), input);
    return response.data.data;
  },

  delete: async (postId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.post(postId));
  },

  /** Submits a draft, or resubmits a rejected post, for moderation review. */
  submit: async (postId: string): Promise<MyPost> => {
    const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.submit(postId));
    return response.data.data;
  },

  archive: async (postId: string): Promise<MyPost> => {
    const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.archive(postId));
    return response.data.data;
  },

  repost: async (postId: string): Promise<MyPost> => {
    const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.repost(postId));
    return response.data.data;
  },

  // Engagement — idempotent server-side, safe to call repeatedly.
  like: async (postId: string): Promise<LikeToggleResult> => {
    const response = await apiClient.post<ApiEnvelope<LikeToggleResult>>(ENDPOINTS.like(postId));
    return response.data.data;
  },

  unlike: async (postId: string): Promise<LikeToggleResult> => {
    const response = await apiClient.delete<ApiEnvelope<LikeToggleResult>>(
      ENDPOINTS.like(postId),
    );
    return response.data.data;
  },

  save: async (postId: string): Promise<SaveToggleResult> => {
    const response = await apiClient.post<ApiEnvelope<SaveToggleResult>>(ENDPOINTS.save(postId));
    return response.data.data;
  },

  unsave: async (postId: string): Promise<SaveToggleResult> => {
    const response = await apiClient.delete<ApiEnvelope<SaveToggleResult>>(
      ENDPOINTS.save(postId),
    );
    return response.data.data;
  },

  getSavedPosts: async (
    params: GetSavedPostsParams = {},
  ): Promise<{ items: SavedPost[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiEnvelope<SavedPost[]>>(
      `${ENDPOINTS.savedPosts}${buildQuery({ page: params.page, perPage: params.perPage })}`,
    );
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },

  /** Every valid call creates a new report — not idempotent like like/save. */
  report: async (postId: string, reason: string, details?: string): Promise<ReportPostResult> => {
    const response = await apiClient.post<ApiEnvelope<ReportPostResult>>(
      ENDPOINTS.reports(postId),
      { reason, details },
    );
    return response.data.data;
  },
};
