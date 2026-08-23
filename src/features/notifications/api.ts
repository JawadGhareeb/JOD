import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { MobileNotification, NotificationParams } from "./types";
export const notificationsApi = {
  list: async (params: NotificationParams = {}) => { const response = await apiClient.get<ApiEnvelope<MobileNotification[], PaginationMeta>>(`/me/notifications${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  unreadCount: async () => { const response = await apiClient.get<ApiEnvelope<{ unreadCount: number }>>("/me/notifications/unread-count"); return response.data.data.unreadCount; },
  readAll: async () => { const response = await apiClient.patch<ApiEnvelope<{ updatedCount: number; unreadCount: number }>>("/me/notifications/read-all"); return response.data.data; },
  detail: async (id: string) => { const response = await apiClient.get<ApiEnvelope<MobileNotification>>(`/me/notifications/${id}`); return response.data.data; },
  markRead: async (id: string) => { const response = await apiClient.patch<ApiEnvelope<MobileNotification>>(`/me/notifications/${id}/read`); return response.data.data; },
  markUnread: async (id: string) => { const response = await apiClient.patch<ApiEnvelope<MobileNotification>>(`/me/notifications/${id}/unread`); return response.data.data; },
};
