export type MediaModel = "organization" | "campaign" | "post";
export type MediaProp = "logo" | "images" | "videos";

export interface MediaUploadFile {
  uri: string;
  name: string;
  type: string;
}

export interface MediaItem {
  id: string;
  model: MediaModel;
  modelId: string;
  prop: MediaProp;
  url: string;
  originalName: string;
  description?: string | null;
  mimeType: string | null;
  size: number;
  position: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PublicMediaOrganization {
  id: string;
  name: string;
  image?: string | null;
  logo?: MediaItem | null;
}

export interface PublicMediaItem {
  id: string;
  model: "organization";
  modelId: string;
  prop: "videos";
  url: string;
  originalName: string;
  description: string | null;
  mimeType: string | null;
  size: number;
  position: number;
  likesCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  organization?: PublicMediaOrganization | null;
}

export interface PublicMediaParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface MediaEngagementState {
  mediaId: string;
  isLiked?: boolean;
  likesCount?: number;
  isSaved?: boolean;
  savesCount?: number;
}

export interface MediaReportResult {
  id: string;
  mediaId: string | null;
  status: string;
}
