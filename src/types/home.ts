import { HomePostTypeEnum } from "@/src/constants/global";

export type Publisher = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  verified?: boolean;
};

export type HomePostType = HomePostTypeEnum;

export type HomePostActionType = "apply" | "donate" | "contact" | "details" | "none";

export type HomePostActionState = "open" | "submitted" | "closed";

export type HomePostAction = {
  type: HomePostActionType;
  label: string;
  state?: HomePostActionState;
};

export type HomePost = {
  id: string;
  publisher: Publisher;
  postType: HomePostType;
  content: string;
  createdAt: string; // ISO date from backend
  images: string[];
  cta: HomePostAction;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  saved?: boolean;
};

export type HomeFeedPayload = {
  posts: HomePost[];
};
