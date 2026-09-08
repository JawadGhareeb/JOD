import type { MediaUploadFile } from "@/src/features/media/types";

export type PersonalCampaignStatus = "pending" | "active" | "rejected" | "suspended" | "closed";
export interface PersonalCampaign {
  id: string; ownerType: "personal"; title: string; summary: string; content: string | null; categoryId: string;
  category: { id: string; name: string } | null; audience: "general" | "student"; status: PersonalCampaignStatus;
  location: string; goalAmount: number; raisedAmount: number; beneficiariesCount: number; donorsCount: number; images: string[];
  creator: { id: string; name: string; email?: string | null; phone?: string | null; city?: string | null; avatarUrl?: string | null } | null;
  startDate: string | null; endDate: string | null; submittedAt: string | null; reviewedAt: string | null;
  rejectionReason: string | null; suspensionReason: string | null; closedAt: string | null; closedReason: string | null;
  createdAt: string | null; updatedAt: string | null; can: { edit: boolean; close: boolean; manageDonations: boolean };
}
export interface PersonalCampaignInput { title: string; summary: string; content?: string | null; categoryId: string; audience?: "general" | "student"; location: string; goalAmount: number; beneficiariesCount?: number; startDate?: string | null; endDate?: string | null; images?: MediaUploadFile[]; }
export interface PersonalCampaignParams { page?: number; perPage?: number; status?: PersonalCampaignStatus; }
