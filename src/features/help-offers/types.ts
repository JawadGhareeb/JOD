export type HelpRequestStatus = "open" | "in_progress" | "fulfilled";
export type HelpOfferStatus = "pending" | "accepted" | "contacting" | "agreed" | "completed" | "rejected" | "cancelled";
export type HelpType = "financial" | "supplies" | "service" | "transportation" | "medicine" | "food" | "other";
export type HelpContactMethod = "phone" | "whatsapp" | "email" | "other";

export interface HelpOfferInput { type: HelpType; amount?: number; description?: string | null; contactMethod?: HelpContactMethod | null; phone?: string | null }
export interface HelpOffer {
  id: string;
  postId: string;
  post: { id: string; title: string | null; helpStatus: HelpRequestStatus };
  helper: { id: string; name: string };
  type: HelpType;
  amount: number | null;
  description: string | null;
  status: HelpOfferStatus;
  contactMethod: HelpContactMethod | string | null;
  phone: string | null;
  cancelReason: string | null;
  rejectionReason: string | null;
  createdAt: string | null;
  acceptedAt: string | null;
  contactedAt: string | null;
  agreedAt: string | null;
  helperConfirmedAt: string | null;
  receiverConfirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  rejectedAt: string | null;
  can: { accept: boolean; reject: boolean; confirmProvided: boolean; confirmReceived: boolean };
}
export interface HelpOffersParams { page?: number; perPage?: number; status?: HelpOfferStatus; postId?: string; flow?: "made" | "received" }
