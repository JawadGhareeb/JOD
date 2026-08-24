import type { HelpOffersParams } from "./types";
export const helpOfferKeys = { all: ["help-offers"] as const, lists: () => [...helpOfferKeys.all, "list"] as const, list: (params: HelpOffersParams) => [...helpOfferKeys.lists(), params] as const, details: () => [...helpOfferKeys.all, "detail"] as const, detail: (id: string) => [...helpOfferKeys.details(), id] as const };
