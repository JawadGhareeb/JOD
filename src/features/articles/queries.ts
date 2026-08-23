import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { articlesApi } from "./api";
import { articleKeys } from "./query-keys";
import type { ArticleParams } from "./types";
export function useArticles(params: Omit<ArticleParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: articleKeys.list(params),
    queryFn: ({ pageParam }) => articlesApi.list({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
  });
}
export function useArticle(id?: string) { return useQuery({ queryKey: articleKeys.detail(id ?? ""), queryFn: () => articlesApi.detail(id!), enabled: Boolean(id) }); }
