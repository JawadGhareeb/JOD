import type { Campaign, HomePost, Publisher } from "@/src/features/posts/types";

export type GlobalSearchType = "all" | "accounts" | "posts" | "campaigns";
export interface GlobalSearchParams {
  search?: string;
  type?: GlobalSearchType;
  location?: string;
  category?: string;
  sort?: "newest" | "oldest";
  perType?: number;
}
export interface SearchAccount extends Publisher { accountType: "organization" | "user" }
export interface GlobalSearchData { accounts: SearchAccount[]; posts: HomePost[]; campaigns: Campaign[] }
export interface GlobalSearchMeta {
  counts: { accounts: number; posts: number; campaigns: number };
  appliedFilters: GlobalSearchParams;
}
