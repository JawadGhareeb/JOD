export type NotificationCategory = "campaign" | "post" | "report" | "system";

export type NotificationDateFilter = "all" | "today" | "last_7_days";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  referenceType?: "donation" | "volunteer" | "job" | "report";
  referenceId?: string;
}

export interface NotificationPreferences {
  campaign: boolean;
  post: boolean;
  report: boolean;
  system: boolean;
  doNotDisturb: boolean;
}
