export type NotificationCategory = "donation" | "help" | "campaign" | "applicant" | "post" | "report" | "account" | "staff" | "system" | string;
export interface MobileNotification {
  id: string; title: string; body: string; category: NotificationCategory; eventType: string | null; priority: "normal" | "high" | string; status: "read" | "unread"; isRead: boolean;
  referenceLabel: string | null; referencePath: string | null; sentAt: string | null; readAt: string | null; createdAt: string | null;
  type?: string; actionLabel?: string | null; action?: { label?: string | null; route?: string | null } | null;
}
export interface NotificationParams { page?: number; perPage?: number; status?: "unread" | "read"; category?: string; priority?: "normal" | "high" }
