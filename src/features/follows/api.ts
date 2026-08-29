import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type {
  FollowState,
  FollowTargetType,
  FollowedPublisher,
  FollowingFeedItem,
  FollowingFeedParams,
  MyFollowingParams,
} from "./types";

export const followsApi = {
  /** Idempotent — repeating the request does not create another relationship. */
  follow: async (targetType: FollowTargetType, targetId: string) => {
    const response = await apiClient.put<ApiEnvelope<FollowState>>(
      `/publishers/${targetType}/${targetId}/follow`,
    );
    return response.data.data;
  },
  /** Idempotent even when no relationship exists. */
  unfollow: async (targetType: FollowTargetType, targetId: string) => {
    const response = await apiClient.delete<ApiEnvelope<FollowState>>(
      `/publishers/${targetType}/${targetId}/follow`,
    );
    return response.data.data;
  },
  myFollowing: async (params: MyFollowingParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<FollowedPublisher[], PaginationMeta>>(
      `/me/following${buildQuery(params)}`,
    );
    return { items: response.data.data, meta: response.data.meta };
  },
  feed: async (params: FollowingFeedParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<FollowingFeedItem[], PaginationMeta>>(
      `/discovery/following${buildQuery(params)}`,
    );
    return { items: response.data.data, meta: response.data.meta };
  },
};
