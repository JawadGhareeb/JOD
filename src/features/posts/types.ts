import { HomePostTypeEnum } from "@/src/constants/global";

export type CreatePostType = "volunteer" | "donation" | "help";
export type ApiPostType = "volunteer_opportunity" | "donation_campaign" | "help_request";
export type HomePostType = HomePostTypeEnum;

export interface Publisher {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  verified?: boolean;
  bio?: string;
  city?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
}

export type HomePostActionType = "apply" | "donate" | "contact" | "details" | "none";
export type HomePostActionState = "open" | "submitted" | "closed";
export interface HomePostAction { type: HomePostActionType; label: string; targetId?: string; state?: HomePostActionState }

export interface HomePost {
  id: string;
  publisher: Publisher;
  postType: HomePostType;
  title?: string;
  content: string;
  createdAt: string | null;
  images: string[];
  cta: HomePostAction;
  stats: { likes: number; comments: number; shares: number };
  viewsCount: number;
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  saved: boolean;
  status: string;
  campaignId: string | null;
  location: string | null;
  phoneNumber?: string;
  whatsappNumber?: string;
}
export type HomeFeedPayload = { posts: HomePost[] };

export interface GetDiscoveryPostsParams {
  page?: number; perPage?: number; search?: string; status?: "published";
  actionState?: "open" | "submitted" | "closed"; type?: string; location?: string;
  categoryId?: string; category?: string; organizationId?: string;
  sort?: "title" | "-title" | "updatedAt" | "-updatedAt" | "newest" | "oldest" | "most_engaged";
  sortBy?: "title_asc" | "title_desc" | "updated_oldest" | "newest" | "oldest" | "most_engaged";
}

export interface GetDiscoveryCampaignsParams {
  page?: number; perPage?: number; search?: string; status?: "active"; category?: string;
  location?: string; organizationId?: string;
  sort?: "updatedAt" | "-updatedAt" | "newest" | "oldest" | "progress" | "-progress";
  sortBy?: "updated_oldest" | "newest" | "oldest" | "progress_highest" | "progress_lowest";
}

export interface GetCategoriesParams { page?: number; perPage?: number; search?: string; status?: "active"; target?: "post" | "campaign"; sort?: "createdAt" | "-createdAt" }

export interface Campaign {
  id: string; title: string; summary: string | null; content: string; category: string | null; status: string;
  publisher: Publisher; images: string[]; location: string | null; goalAmount: number; raisedAmount: number;
  beneficiariesCount: number; donorsCount: number; applicantsCount: number;
  stats: { likes: number; comments: number; shares: number };
  viewsCount: number; reactionsCount: number; commentsCount: number; sharesCount: number;
  startDate: string | null; endDate: string | null; submittedAt: string | null; createdAt: string | null; updatedAt: string | null;
  closedAt: string | null; closedReason: string | null; reviewedBy?: string | null; rejectionReason: string | null;
  organizationName: string | null; managerName: string | null; phoneNumber?: string; whatsappNumber?: string;
}

export interface Category { id: string; name: string; target: "post" | "campaign"; description: string | null; usageCount: number; status: string; createdAt: string | null; updatedAt: string | null }

export interface CreatePostInput {
  type: ApiPostType; title?: string | null; details?: string | null; city?: string | null; categoryId?: string | null; saveAsDraft?: boolean;
}
export interface UpdatePostInput {
  type?: ApiPostType; title?: string | null; details?: string | null; city?: string | null; categoryId?: string | null;
}
export type PostInput = CreatePostInput;

export type MyPostStatus = "draft" | "pending" | "active" | "rejected" | "archived";
export interface PostImageMedia { id: string; url: string; position: number }
export interface MyPost {
  id: string; ownerId: string | null; title: string | null; details: string | null; city: string | null; type: string; categoryId: string | null;
  images: string[]; imageMedia: PostImageMedia[]; viewsCount: number; reactionsCount: number; commentsCount: number; sharesCount: number;
  stats: { likes: number; comments: number; shares: number }; status: MyPostStatus; rejectionReason: string | null;
  submittedAt: string | null; reviewedAt: string | null; createdAt: string | null; updatedAt: string | null; publishedAt: string | null;
}
export interface GetMyPostsParams { page?: number; perPage?: number; status?: MyPostStatus; sort?: "createdAt" | "-createdAt" | "updatedAt" | "-updatedAt" | "title" | "-title" }

export interface MobileImageFile { uri: string; name: string; type: string }
export interface LikeToggleResult { postId: string; isLiked: boolean; likesCount: number }
export interface SaveToggleResult { postId: string; isSaved: boolean; savesCount: number }
export interface ReportPostResult { id: string; postId: string | null; status: string }
export type SavedPost = HomePost & { savedAt?: string | null };
export interface GetSavedPostsParams { page?: number; perPage?: number }
