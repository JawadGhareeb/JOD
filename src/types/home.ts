export type Publisher = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  verified?: boolean;
};

export type HomePost = {
  id: string;
  publisher: Publisher;
  content: string;
  createdAt: string; // ISO date from backend
  images: string[];
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
