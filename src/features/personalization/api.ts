import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { CompleteOnboardingInput, PersonalizationOptions, PersonalizationProfile, PersonalizedFeedItem, PersonalizedFeedType } from "./types";

export const personalizationApi = {
  getOptions: async (): Promise<PersonalizationOptions> => {
    const response = await apiClient.get<ApiEnvelope<PersonalizationOptions>>("/onboarding/options");
    return response.data.data;
  },
  getProfile: async (): Promise<PersonalizationProfile> => {
    const response = await apiClient.get<ApiEnvelope<PersonalizationProfile>>("/me/preferences");
    return response.data.data;
  },
  completeOnboarding: async (input: CompleteOnboardingInput): Promise<PersonalizationProfile> => {
    const response = await apiClient.post<ApiEnvelope<PersonalizationProfile>>("/me/onboarding", input);
    return response.data.data;
  },
  updatePreferences: async (input: Partial<Omit<CompleteOnboardingInput, "categoryIds" | "capabilityIds">>): Promise<PersonalizationProfile> => {
    const response = await apiClient.patch<ApiEnvelope<PersonalizationProfile>>("/me/preferences", input);
    return response.data.data;
  },
  updateInterests: async (categoryIds: string[]): Promise<PersonalizationProfile> => {
    const response = await apiClient.patch<ApiEnvelope<PersonalizationProfile>>("/me/interests", { categoryIds });
    return response.data.data;
  },
  updateCapabilities: async (capabilityIds: string[]): Promise<PersonalizationProfile> => {
    const response = await apiClient.patch<ApiEnvelope<PersonalizationProfile>>("/me/capabilities", { capabilityIds });
    return response.data.data;
  },
  getFeed: async (type: PersonalizedFeedType, page: number, perPage = 20) => {
    const response = await apiClient.get<ApiEnvelope<PersonalizedFeedItem[], PaginationMeta & { feedType: PersonalizedFeedType }>>(`/feed${buildQuery({ type, page, perPage })}`);
    return { items: response.data.data, meta: response.data.meta };
  },
};
