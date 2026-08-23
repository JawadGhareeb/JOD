import type { ArticleParams } from "./types";
export const articleKeys = { all: ["articles"] as const, list: (params: ArticleParams) => [...articleKeys.all, "list", params] as const, detail: (id: string) => [...articleKeys.all, "detail", id] as const };
