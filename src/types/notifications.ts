export type NotificationType =
  | "campaign"
  | "volunteer"
  | "comment"
  | "saved"
  | "system";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  actionLabel?: string;
};

export type NotificationsPayload = {
  notifications: NotificationItem[];
};
