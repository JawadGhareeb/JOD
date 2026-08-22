import { HomePostTypeEnum } from "@/src/constants/global";

// ---- The 3-way create-post picker, and the shared feed/detail post ----

export type CreatePostType = "volunteer" | "donation" | "help";

export type Publisher = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  verified?: boolean;
  phoneNumber?: string;
  whatsappNumber?: string;
};

export type HomePostType = HomePostTypeEnum;

export type HomePostActionType = "apply" | "donate" | "contact" | "details" | "none";

export type HomePostActionState = "open" | "submitted" | "closed";

export type HomePostAction = {
  type: HomePostActionType;
  label: string;
  state?: HomePostActionState;
  // Present on live API responses; semantics not yet confirmed against a
  // donate/apply-type sample (only verified equal to the post's own id on a
  // "contact"-type post) — don't route on this without confirming first.
  targetId?: string;
};

export type HomePost = {
  id: string;
  publisher: Publisher;
  postType: HomePostType;
  title?: string;
  content: string;
  createdAt: string; // ISO date from backend
  images: string[];
  cta: HomePostAction;
  phoneNumber?: string;
  whatsappNumber?: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  saved?: boolean;
  // Added once the live API's shape was confirmed — optional since older
  // mock fixtures elsewhere in the app don't set them.
  status?: string;
  campaignId?: string | null;
  location?: string;
  viewsCount?: number;
};

export type HomeFeedPayload = {
  posts: HomePost[];
};

// ---- Discovery query params ----

export interface GetDiscoveryPostsParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "published";
  type?: string;
  location?: string;
  organizationId?: string;
  sort?: "title" | "-title" | "updatedAt" | "-updatedAt";
  sortBy?: "title_asc" | "title_desc" | "updated_oldest";
}

export interface GetDiscoveryCampaignsParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "active";
  category?: string;
  location?: string;
  organizationId?: string;
  sort?: "updatedAt" | "-updatedAt" | "progress" | "-progress";
  sortBy?: "updated_oldest" | "progress_highest" | "progress_lowest";
}

export interface GetCategoriesParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "active";
  target?: "post" | "campaign";
  sort?: "createdAt" | "-createdAt";
}

/** A campaign is a distinct resource from a post — it can carry both a
 * donor count and an applicant count at once (one campaign, both a donation
 * and a volunteering angle), differentiated by `category`, not by type. */
export interface Campaign {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  status: string;
  publisher: Publisher;
  images: string[];
  location: string | null;
  goalAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  donorsCount: number;
  applicantsCount: number;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  viewsCount: number;
  startDate: string | null;
  endDate: string | null;
  submittedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  closedAt: string | null;
  closedReason: string | null;
  rejectionReason: string | null;
  organizationName: string | null;
  managerName: string | null;
  phoneNumber?: string;
  whatsappNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  target: "post" | "campaign";
  description: string | null;
  usageCount: number;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

// ---- Own-post lifecycle (UserPost) ----

export type ApiPostType = "volunteer_opportunity" | "donation_campaign" | "help_request";

export interface PostInput {
  type: ApiPostType;
  title?: string;
  details?: string;
  city?: string;
  categoryId?: string;
  saveAsDraft?: boolean;
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

// ---- Engagement (like / save / report) ----

export interface LikeToggleResult {
  postId: string;
  isLiked: boolean;
  likesCount: number;
}

export interface SaveToggleResult {
  postId: string;
  isSaved: boolean;
  savesCount: number;
}

export interface ReportPostResult {
  id: string;
  postId: string | null;
  status: string;
}

/**
 * `/discovery/posts` was confirmed live to match `HomePost` almost exactly
 * (publisher object, content, images, cta, stats). `/me/saved-posts` was
 * asked to get the same enrichment but hasn't been independently verified
 * against a live sample yet — spot-check this once it's wired in.
 */
export type SavedPost = HomePost & { savedAt: string | null };

export interface GetSavedPostsParams {
  page?: number;
  perPage?: number;
}
