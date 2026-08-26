export interface CityLookupItem {
  isActive: boolean;
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
}

export type ReportReasonCode = "misleading" | "abusive" | "fraud" | "impersonation" | "other";
export interface ReportReasonLookupItem {
  isActive: boolean;
  id: string;
  code: ReportReasonCode;
  label: string;
  hint: string;
  allowsCustomText: boolean;
  sortOrder: number;
}

export type CreatablePostTypeCode = "volunteer_opportunity" | "donation_campaign" | "help_request" | "service_offer";
export type PostTypeCode = CreatablePostTypeCode | "campaign_update" | "awareness";
export interface PostTypeLookupItem {
  isActive: boolean;
  code: PostTypeCode;
  label: string;
  hint: string;
  canCreate: boolean;
  canFilter: boolean;
  sortOrder: number;
}

export interface CodeLabelLookupItem {
  isActive: boolean;
  code: string;
  label: string;
  hint?: string;
  sortOrder: number;
}

export interface LookupParams { search?: string; status?: string }
