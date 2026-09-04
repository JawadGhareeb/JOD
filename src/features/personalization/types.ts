import type { PublicMediaItem } from "@/src/features/media/types";
import type { Campaign, HomePost } from "@/src/features/posts/types";

export type UserIntent = "giver" | "receiver" | "both";
export type PersonalizationMissingField = "intent" | "interests" | "preferredCity" | "capabilities";
export type PersonalizedFeedType = "for_you" | "following" | "nearby" | "urgent";

export interface PersonalizationOption { value: string; label: string }
export interface PersonalizationCategory { id: string; name: string; description?: string | null }
export interface PersonalizationCapability { id: string; name: string; slug: string }
export interface PersonalizationOptions {
  intents: PersonalizationOption[];
  categories: PersonalizationCategory[];
  capabilities: PersonalizationCapability[];
}

export interface UserInterest {
  category: { id: string; name: string };
  selectedByUser: boolean;
  explicitWeight: number;
  behavioralWeight: number;
}

export interface PersonalizationProfile {
  onboardingCompleted: boolean;
  missingFields: PersonalizationMissingField[];
  intent: UserIntent | null;
  preferredCity: string | null;
  remoteHelpEnabled: boolean;
  interests: UserInterest[];
  capabilities: PersonalizationCapability[];
}

export interface CompleteOnboardingInput {
  intent?: UserIntent | null;
  categoryIds?: string[];
  capabilityIds?: string[];
  preferredCity?: string | null;
  remoteHelpEnabled?: boolean;
}

export interface UpdatePersonalizationInput {
  intent: UserIntent | null;
  categoryIds: string[];
  capabilityIds: string[];
  preferredCity: string | null;
  remoteHelpEnabled: boolean;
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
  content: (HomePost | Campaign | PublicMediaItem) & { urgency?: "normal" | "important" | "urgent" | "critical"; expiresAt?: string | null };
}
