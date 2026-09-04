import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personalizationApi } from "./api";
import type { CompleteOnboardingInput, PersonalizedFeedType, UpdatePersonalizationInput } from "./types";

export const personalizationKeys = {
  all: ["personalization"] as const,
  options: () => [...personalizationKeys.all, "options"] as const,
  profile: () => [...personalizationKeys.all, "profile"] as const,
  feed: (type: PersonalizedFeedType) => [...personalizationKeys.all, "feed", type] as const,
};

export function usePersonalizationOptions() {
  return useQuery({ queryKey: personalizationKeys.options(), queryFn: personalizationApi.getOptions, staleTime: 10 * 60 * 1000 });
}

export function usePersonalizationProfile(enabled = true) {
  return useQuery({ queryKey: personalizationKeys.profile(), queryFn: personalizationApi.getProfile, enabled, staleTime: 60 * 1000 });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CompleteOnboardingInput) => personalizationApi.completeOnboarding(input),
    onSuccess: (data, input) => {
      queryClient.setQueryData(personalizationKeys.profile(), data);
      queryClient.invalidateQueries({ queryKey: personalizationKeys.feed("for_you") });
      if ("preferredCity" in input) queryClient.invalidateQueries({ queryKey: personalizationKeys.feed("nearby") });
    },
  });
}

export function useSkipPersonalizationOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: personalizationApi.skipOnboarding,
    onSuccess: (data) => {
      queryClient.setQueryData(personalizationKeys.profile(), data);
      queryClient.invalidateQueries({ queryKey: personalizationKeys.feed("for_you") });
    },
  });
}

export function useUpdatePersonalization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePersonalizationInput) => {
      await personalizationApi.updatePreferences({
        ...(input.intent ? { intent: input.intent } : {}),
        preferredCity: input.preferredCity,
        remoteHelpEnabled: input.remoteHelpEnabled,
      });
      await personalizationApi.updateInterests(input.categoryIds);
      return personalizationApi.updateCapabilities(input.capabilityIds);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(personalizationKeys.profile(), data);
      queryClient.invalidateQueries({ queryKey: personalizationKeys.feed("for_you") });
      queryClient.invalidateQueries({ queryKey: personalizationKeys.feed("nearby") });
    },
  });
}

export function useRecommendationFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentType, contentId, action }: { contentType: "post" | "campaign" | "media" | "article"; contentId: string; action: "interested" | "not_interested" }) => personalizationApi.submitFeedback(contentType, contentId, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: personalizationKeys.all }),
  });
}

export function usePersonalizedFeed(type: PersonalizedFeedType, enabled = true) {
  return useInfiniteQuery({
    queryKey: personalizationKeys.feed(type),
    queryFn: ({ pageParam }) => personalizationApi.getFeed(type, pageParam, 20),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
  });
}
