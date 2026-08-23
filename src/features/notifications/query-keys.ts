import type { NotificationParams } from "./types";
export const notificationKeys = { all: ["notifications"] as const, list: (params: NotificationParams) => [...notificationKeys.all, "list", params] as const, unread: () => [...notificationKeys.all, "unread-count"] as const, detail: (id: string) => [...notificationKeys.all, "detail", id] as const };
