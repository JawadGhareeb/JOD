import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/src/features/posts/query-keys";
import type { Publisher } from "@/src/features/posts/types";
import { followsApi } from "./api";
import { followKeys } from "./query-keys";
import type { FollowState, FollowTargetType, FollowingFilter } from "./types";

type FollowVariables = { targetType: FollowTargetType; targetId: string };
type PublisherSnapshot = Publisher | undefined;

/**
 * Applies the follow state the server will confirm, so the button flips instantly.
 * `followersCount` is clamped at zero — a stale cached count must never render as -1.
 */
function patchPublisher(current: PublisherSnapshot, isFollowing: boolean): PublisherSnapshot {
  if (!current) return current;
  const base = current.followersCount ?? 0;
  return {
    ...current,
    isFollowing,
    followersCount: isFollowing ? base + 1 : Math.max(0, base - 1),
  };
}

function useFollowMutation(isFollowing: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ targetType, targetId }: FollowVariables) =>
      isFollowing ? followsApi.follow(targetType, targetId) : followsApi.unfollow(targetType, targetId),

    onMutate: async ({ targetId }) => {
      const key = postKeys.publisher(targetId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Publisher>(key);
      queryClient.setQueryData<PublisherSnapshot>(key, (current) => patchPublisher(current, isFollowing));
      return { key, previous };
    },

    // Roll back to exactly what was cached before, rather than re-inverting the
    // optimistic patch — that would drift if the server had already changed it.
    onError: (_error, _variables, context) => {
      if (context) queryClient.setQueryData(context.key, context.previous);
    },

    // Trust the server's count over the optimistic guess.
    onSuccess: (state: FollowState, { targetId }) => {
      queryClient.setQueryData<PublisherSnapshot>(postKeys.publisher(targetId), (current) =>
        current
          ? { ...current, isFollowing: state.isFollowing, followersCount: state.followersCount }
          : current,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all });
    },
  });
}

export const useFollowPublisher = () => useFollowMutation(true);
export const useUnfollowPublisher = () => useFollowMutation(false);

export function useMyFollowing(type: FollowingFilter = "all", enabled = true) {
  return useInfiniteQuery({
    queryKey: followKeys.following(type),
    queryFn: ({ pageParam }) => followsApi.myFollowing({ type, page: pageParam, perPage: 20 }),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (last) =>
      last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
  });
}

export function useFollowingFeed(enabled = true) {
  return useInfiniteQuery({
    queryKey: followKeys.feed(),
    queryFn: ({ pageParam }) => followsApi.feed({ page: pageParam, perPage: 20 }),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (last) =>
      last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
  });
}
