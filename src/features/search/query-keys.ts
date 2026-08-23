import type { GlobalSearchParams } from "./types";
export const searchKeys = { all: ["search"] as const, results: (params: GlobalSearchParams) => [...searchKeys.all, params] as const };
