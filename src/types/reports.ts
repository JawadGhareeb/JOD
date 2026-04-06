export type ReportStatus = "new" | "in_progress" | "waiting_response" | "closed";

export type ReportEntityType = "post" | "campaign" | "user" | "organization" | "job";

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  entityType: ReportEntityType;
  entityId: string;
  createdAt: string;
}

export interface BlockedEntity {
  id: string;
  entityType: Extract<ReportEntityType, "user" | "organization">;
  blockedAt: string;
}
