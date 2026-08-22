import type { HomePost } from "@/src/features/posts/types";

export type ProfilePostStatus = "posted" | "unposted" | "archived";

export type ProfilePost = HomePost & {
  profileStatus: ProfilePostStatus;
};

export type ProfileSummary = {
  id: string;
  name: string;
  username: string;
  bio: string;
  city: string;
  verified: boolean;
  avatarUrl?: string;
  stats: {
    postsCount: number;
    savedCount: number;
    donationsCount: number;
  };
};

export type ProfilePayload = {
  summary: ProfileSummary;
  posts: ProfilePost[];
};
