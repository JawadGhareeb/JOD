import type { ApplicationsParams } from "./types";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (params: Omit<ApplicationsParams, "page"> = {}) => [...applicationKeys.lists(), params] as const,
  detail: (id: string) => [...applicationKeys.all, "detail", id] as const,
};
