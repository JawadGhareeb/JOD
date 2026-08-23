export interface CampaignApplicationInput { phone?: string | null; city?: string | null }
export interface CampaignApplication {
  id: string;
  campaignId: string;
  campaignTitle: string;
  organizationName: string | null;
  status: string;
  phone: string | null;
  city: string | null;
  submittedAt: string | null;
  updatedAt: string | null;
}
export interface ApplicationsParams { page?: number; perPage?: number; campaignId?: string; status?: string }
