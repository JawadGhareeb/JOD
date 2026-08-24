export type MediaModel = "organization" | "campaign" | "post";
export type MediaProp = "logo" | "images";

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
  mimeType: string | null;
  size: number;
  position: number;
  createdAt: string | null;
  updatedAt: string | null;
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
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PublicMediaParams {
  page?: number;
  perPage?: number;
  search?: string;
}
