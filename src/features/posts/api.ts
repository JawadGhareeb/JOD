import { Platform } from "react-native";
import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type {
  ApiPostType, Campaign, Category, CreatePostInput, CreatePostType, GetCategoriesParams,
  GetDiscoveryCampaignsParams, GetDiscoveryPostsParams, GetMyPostsParams, GetSavedPostsParams,
  HomePost, LikeToggleResult, MobileImageFile, MyPost, Publisher, ReportPostResult, SavedPost,
  SaveToggleResult, UpdatePostInput,
} from "./types";

export const POST_TYPE_TO_API_TYPE: Record<CreatePostType, ApiPostType> = {
  volunteer: "volunteer_opportunity", donation: "donation_campaign", help: "help_request", service: "service_offer",
};
export const API_TYPE_TO_POST_TYPE: Record<ApiPostType, CreatePostType> = {
  volunteer_opportunity: "volunteer", donation_campaign: "donation", help_request: "help", service_offer: "service",
};

const ENDPOINTS = {
  postImages: (id: string) => `/posts/${id}/images`, imageOrder: (id: string) => `/posts/${id}/images/order`, postImage: (id: string, imageId: string) => `/posts/${id}/images/${imageId}`,
  discoveryPosts: "/discovery/posts", discoveryCampaigns: "/discovery/campaigns", discoveryCategories: "/discovery/categories",
  publisher: (id: string) => `/discovery/publishers/${id}`, publisherPosts: (id: string) => `/discovery/publishers/${id}/posts`,
  posts: "/posts", post: (id: string) => `/posts/${id}`, submit: (id: string) => `/posts/${id}/submit`,
  like: (id: string) => `/posts/${id}/like`, save: (id: string) => `/posts/${id}/save`, reports: (id: string) => `/posts/${id}/reports`,
  myPosts: "/me/posts", myPost: (id: string) => `/me/posts/${id}`, savedPosts: "/me/saved-posts",
} as const;

const toPostImagesFormData = async (images: MobileImageFile[]) => {
  const form = new FormData();
  for (const image of images) {
    if (Platform.OS === "web") {
      const blob = await fetch(image.uri).then((response) => response.blob());
      form.append("images[]", blob, image.name);
    } else {
      form.append("images[]", image as unknown as Blob);
    }
  }
  return form;
};

export const postsApi = {
  getFeed: async (params: GetDiscoveryPostsParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<HomePost[], PaginationMeta>>(`${ENDPOINTS.discoveryPosts}${buildQuery(params)}`);
    return { items: response.data.data, meta: response.data.meta };
  },
  getPost: async (id: string) => { const response = await apiClient.get<ApiEnvelope<HomePost>>(`${ENDPOINTS.discoveryPosts}/${id}`); return response.data.data; },
  getPublisher: async (id: string) => { const response = await apiClient.get<ApiEnvelope<Publisher>>(ENDPOINTS.publisher(id)); return response.data.data; },
  getPublisherPosts: async (id: string, params: GetDiscoveryPostsParams = {}) => { const response = await apiClient.get<ApiEnvelope<HomePost[], PaginationMeta>>(`${ENDPOINTS.publisherPosts(id)}${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  getCampaigns: async (params: GetDiscoveryCampaignsParams = {}) => { const response = await apiClient.get<ApiEnvelope<Campaign[], PaginationMeta>>(`${ENDPOINTS.discoveryCampaigns}${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  getCampaign: async (id: string) => { const response = await apiClient.get<ApiEnvelope<Campaign>>(`${ENDPOINTS.discoveryCampaigns}/${id}`); return response.data.data; },
  getCategories: async (params: GetCategoriesParams = {}) => { const response = await apiClient.get<ApiEnvelope<Category[], PaginationMeta>>(`${ENDPOINTS.discoveryCategories}${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  getMyPosts: async (params: GetMyPostsParams = {}) => { const response = await apiClient.get<ApiEnvelope<MyPost[], PaginationMeta>>(`${ENDPOINTS.myPosts}${buildQuery({ page: params.page, perPage: params.perPage, "filter[status]": params.status, sort: params.sort })}`); return { items: response.data.data, meta: response.data.meta }; },
  getMyPost: async (id: string) => { const response = await apiClient.get<ApiEnvelope<MyPost>>(ENDPOINTS.myPost(id)); return response.data.data; },
  create: async (input: CreatePostInput) => { const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.posts, input); return response.data.data; },
  update: async (id: string, input: UpdatePostInput) => { const response = await apiClient.patch<ApiEnvelope<MyPost>>(ENDPOINTS.post(id), input); return response.data.data; },
  delete: async (id: string) => { await apiClient.delete(ENDPOINTS.post(id)); },
  submit: async (id: string) => { const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.submit(id)); return response.data.data; },
  uploadImages: async (id: string, images: MobileImageFile[]) => { const form = await toPostImagesFormData(images); const response = await apiClient.post<ApiEnvelope<MyPost>>(ENDPOINTS.postImages(id), form); return response.data.data; },
  reorderImages: async (id: string, imageIds: string[]) => { const response = await apiClient.patch<ApiEnvelope<MyPost>>(ENDPOINTS.imageOrder(id), { imageIds }); return response.data.data; },
  deleteImage: async (id: string, imageId: string) => { const response = await apiClient.delete<ApiEnvelope<MyPost>>(ENDPOINTS.postImage(id, imageId)); return response.data.data; },
  like: async (id: string) => { const response = await apiClient.post<ApiEnvelope<LikeToggleResult>>(ENDPOINTS.like(id)); return response.data.data; },
  unlike: async (id: string) => { const response = await apiClient.delete<ApiEnvelope<LikeToggleResult>>(ENDPOINTS.like(id)); return response.data.data; },
  save: async (id: string) => { const response = await apiClient.post<ApiEnvelope<SaveToggleResult>>(ENDPOINTS.save(id)); return response.data.data; },
  unsave: async (id: string) => { const response = await apiClient.delete<ApiEnvelope<SaveToggleResult>>(ENDPOINTS.save(id)); return response.data.data; },
  getSavedPosts: async (params: GetSavedPostsParams = {}) => { const response = await apiClient.get<ApiEnvelope<SavedPost[], PaginationMeta>>(`${ENDPOINTS.savedPosts}${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  report: async (id: string, reason: string, details?: string) => { const response = await apiClient.post<ApiEnvelope<ReportPostResult>>(ENDPOINTS.reports(id), { reason, details }); return response.data.data; },
};
