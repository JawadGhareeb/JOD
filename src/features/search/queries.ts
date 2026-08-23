import { useQuery } from "@tanstack/react-query";
import { searchApi } from "./api";
import { searchKeys } from "./query-keys";
import type { GlobalSearchParams } from "./types";
export function useGlobalSearch(params: GlobalSearchParams, enabled = true) {
  return useQuery({ queryKey: searchKeys.results(params), queryFn: () => searchApi.search(params), enabled, placeholderData: (previous) => previous });
}
