import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "./api";
import { notificationKeys } from "./query-keys";
import type { NotificationParams } from "./types";
export function useNotifications(params: Omit<NotificationParams, "page"> = {}, enabled = true) { return useInfiniteQuery({ queryKey: notificationKeys.list(params), queryFn: ({ pageParam }) => notificationsApi.list({ ...params, page: pageParam, perPage: params.perPage ?? 20 }), initialPageParam: 1, enabled, getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined }); }
export function useUnreadNotificationCount(enabled = true) { return useQuery({ queryKey: notificationKeys.unread(), queryFn: notificationsApi.unreadCount, enabled, staleTime: 30_000 }); }
export function useNotification(id?: string) { return useQuery({ queryKey: notificationKeys.detail(id ?? ""), queryFn: () => notificationsApi.detail(id!), enabled: Boolean(id) }); }
function useNotificationMutation(fn: (id: string) => Promise<unknown>) { const qc = useQueryClient(); return useMutation({ mutationFn: fn, onSuccess: () => { qc.invalidateQueries({ queryKey: notificationKeys.all }); } }); }
export const useMarkNotificationRead = () => useNotificationMutation(notificationsApi.markRead);
export const useMarkNotificationUnread = () => useNotificationMutation(notificationsApi.markUnread);
export function useMarkAllNotificationsRead() { const qc = useQueryClient(); return useMutation({ mutationFn: notificationsApi.readAll, onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }) }); }
