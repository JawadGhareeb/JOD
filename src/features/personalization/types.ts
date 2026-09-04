import type { HomePost } from "@/src/features/posts/types";

export type UserIntent = "giver" | "receiver" | "both";
export type AvailabilityStatus = "available" | "busy" | "weekends" | "evenings" | "remote_only";
export type PersonalizedFeedType = "for_you" | "following" | "nearby" | "urgent";

export interface PersonalizationOption { value: string; label: string }
export interface PersonalizationCategory { id: string; name: string; description?: string | null }
export interface PersonalizationCapability { id: string; name: string; slug: string }
export interface PersonalizationOptions {
  intents: PersonalizationOption[];
  categories: PersonalizationCategory[];
  capabilities: PersonalizationCapability[];
  availabilityStatuses: PersonalizationOption[];
}

export interface UserInterest {
  category: { id: string; name: string };
  selectedByUser: boolean;
  explicitWeight: number;
  behavioralWeight: number;
}

export interface PersonalizationProfile {
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  intent: UserIntent | null;
  preferredCity: string | null;
  preferredGovernorate: string | null;
  preferredRadiusKm: number | null;
  remoteHelpEnabled: boolean;
  availabilityStatus: AvailabilityStatus | null;
  interests: UserInterest[];
  capabilities: PersonalizationCapability[];
}

export interface CompleteOnboardingInput {
  intent: UserIntent;
  categoryIds: string[];
  capabilityIds?: string[];
  preferredCity?: string | null;
  preferredGovernorate?: string | null;
  preferredRadiusKm?: number | null;
  remoteHelpEnabled?: boolean;
  availabilityStatus?: AvailabilityStatus | null;
}

export interface RecommendationMeta {
  reasons: string[];
  source?: "personalized" | "exploration" | "following" | "nearby" | "urgent";
  isExploration?: boolean;
  feedbackRequested?: boolean;
}

export interface PersonalizedFeedItem {
  contentType: "post" | "campaign" | "media" | "article" | string;
  publishedAt: string | null;
  recommendation: RecommendationMeta;
  content: HomePost & { urgency?: "normal" | "important" | "urgent" | "critical"; expiresAt?: string | null };
}
