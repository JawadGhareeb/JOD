import type { GroupAdminCandidate } from "./types";

/**
 * TEMPORARY — stands in for the account-search endpoint used to pick group
 * admins. Replace with the real user search; the shape already matches what a
 * publisher/account row returns.
 */
export const mockAdminCandidates: GroupAdminCandidate[] = [
  { id: "usr-001", name: "أحمد الحسين", username: "ahmad.h", avatarUrl: null },
  { id: "usr-002", name: "لجين حياني", username: "lujain", avatarUrl: null },
  { id: "usr-003", name: "مصطفى فارس", username: "mustafa.f", avatarUrl: null },
  { id: "usr-004", name: "شهد بوادقجي", username: "shahd.b", avatarUrl: null },
  { id: "usr-005", name: "عبد الجواد الحاج", username: "abdaljawad", avatarUrl: null },
  { id: "usr-006", name: "رزان الحسن", username: "razan", avatarUrl: null },
  { id: "usr-007", name: "باسل العساف", username: "basel.a", avatarUrl: null },
  { id: "usr-008", name: "ميس أكتع", username: "mays", avatarUrl: null },
  { id: "usr-009", name: "نوّار أبو عمّاش", username: "nawwar", avatarUrl: null },
  { id: "usr-010", name: "فيحاء الخليفة", username: "fayhaa", avatarUrl: null },
];
