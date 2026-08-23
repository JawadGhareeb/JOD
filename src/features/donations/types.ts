export type PaymentMethod = "credit_card" | "bank_transfer" | "cash" | "other";
export interface DonationInput { amount: number; paymentMethod: PaymentMethod; phone?: string | null; city?: string | null }
export interface Donation {
  id: string; campaignId: string; campaignTitle: string; organizationName: string | null;
  amount: number; paymentMethod: string | null; phone: string | null; city: string | null;
  source: string | null; donatedAt: string | null; createdAt: string | null;
  organization?: string | null; donatedAmount?: number; targetAmount?: number; date?: string | null; status?: string; flow?: "contributed" | "received";
}
export interface DonationParams { page?: number; perPage?: number; campaignId?: string }
