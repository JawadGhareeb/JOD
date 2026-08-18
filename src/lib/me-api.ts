import { apiClient } from "./api-client";
import type { AuthUser } from "./auth-api";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";

export interface UpdateProfileInput {
  name: string;
  email: string;
  phone?: string;
}

export type MyPostStatus = "draft" | "pending" | "active" | "rejected" | "archived";

export interface MyPost {
  id: string;
  ownerId: string | null;
  title: string | null;
  details: string | null;
  city: string | null;
  type: string;
  categoryId: string | null;
  images: string[];
  status: MyPostStatus;
  rejectionReason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface GetMyPostsParams {
  page?: number;
  perPage?: number;
  status?: MyPostStatus;
  sort?: "createdAt" | "-createdAt" | "updatedAt" | "-updatedAt" | "title" | "-title";
}

/** The shape `/discovery/posts` and `/me/saved-posts` share — no `content`,
 * no `images`, no publisher contact info. See docs/API_INTEGRATION_GUIDE.md
 * §2.1 for why that matters before wiring this into the feed UI. */
export interface SavedPost {
  id: string;
  title: string | null;
  summary: string | null;
  type: string;
  status: string;
  organizationName: string | null;
  authorName: string | null;
  location: string | null;
  campaignTitle: string | null;
  submittedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  viewsCount: number;
  reactionsCount: number;
  applicationsCount: number;
  savedAt: string | null;
}

export interface GetSavedPostsParams {
  page?: number;
  perPage?: number;
}

const ENDPOINTS = {
  profile: "/me/profile",
  permissions: "/me/permissions",
  posts: "/me/posts",
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

export const meApi = {
  updateProfile: async (input: UpdateProfileInput): Promise<AuthUser> => {
    const response = await apiClient.patch<ApiEnvelope<AuthUser>>(ENDPOINTS.profile, input);
    return response.data.data;
  },

  /** Entry shape is undocumented server-side (`items: {}` in the contract's
   * schema) — treat entries as opaque until there's a real example to type
   * them from. Don't build role-gated UI off this without confirming first. */
  getPermissions: async (): Promise<unknown[]> => {
    const response = await apiClient.get<ApiEnvelope<unknown[]>>(ENDPOINTS.permissions);
    return response.data.data;
  },

  getMyPosts: async (
    params: GetMyPostsParams = {},
  ): Promise<{ items: MyPost[]; meta: PaginationMeta }> => {
    const query = buildQuery({
      page: params.page,
      perPage: params.perPage,
      "filter[status]": params.status,
      sort: params.sort,
    });
    const response = await apiClient.get<ApiEnvelope<MyPost[]>>(`${ENDPOINTS.posts}${query}`);
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },

  getSavedPosts: async (
    params: GetSavedPostsParams = {},
  ): Promise<{ items: SavedPost[]; meta: PaginationMeta }> => {
    const query = buildQuery({ page: params.page, perPage: params.perPage });
    const response = await apiClient.get<ApiEnvelope<SavedPost[]>>(
      `${ENDPOINTS.savedPosts}${query}`,
    );
    return { items: response.data.data, meta: response.data.meta as PaginationMeta };
  },
};
