import type { FollowingFilter } from "./types";

export const followKeys = {
  all: ["follows"] as const,
  following: (type: FollowingFilter) => [...followKeys.all, "following", type] as const,
  feed: () => [...followKeys.all, "feed"] as const,
};
