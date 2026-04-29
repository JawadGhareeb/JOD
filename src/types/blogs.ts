export type BlogCategory =
  | "all"
  | "awareness"
  | "success_stories"
  | "campaign_updates"
  | "volunteer_guides";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: Exclude<BlogCategory, "all">;
  readTimeMinutes: number;
  publishedAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    verified?: boolean;
  };
};

export type BlogsPayload = {
  posts: BlogPost[];
};
