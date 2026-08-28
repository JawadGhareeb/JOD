export type DonationStatus = "pending" | "contacting" | "agreed" | "completed" | "cancelled";
export type ContactMethod = "phone" | "whatsapp" | "email" | "other";
export type PaymentMethod = "bank_transfer" | "cash" | "other";

export interface DonationInput {
  amount: number;
  contactMethod: ContactMethod;
  paymentMethod?: PaymentMethod | null;
  phone?: string | null;
  city?: string | null;
  notes?: string | null;
  /** Publicly anonymous only — the donation stays linked to the donor and still counts toward the campaign. */
  isAnonymous?: boolean;
}

export interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  organizationName: string | null;
  amount: number;
  status: DonationStatus;
  contactMethod: ContactMethod | string | null;
  paymentMethod: PaymentMethod | string | null;
  phone: string | null;
  city: string | null;
  notes: string | null;
  isAnonymous: boolean;
  cancelReason: string | null;
  source: string | null;
  createdAt: string | null;
  contactedAt: string | null;
  agreedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  organization?: string | null;
  donatedAmount?: number;
  targetAmount?: number;
  date?: string | null;
  flow?: "contributed" | "received";
}

export interface DonationParams {
  page?: number;
  perPage?: number;
  campaignId?: string;
  status?: DonationStatus;
  flow?: "contributed" | "received";
}
