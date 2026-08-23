import type { DonationParams } from "./types";
export const donationKeys = { all: ["donations"] as const, list: (params: DonationParams) => [...donationKeys.all, "list", params] as const, detail: (id: string) => [...donationKeys.all, "detail", id] as const };
