import { mockGroupMembers } from "./mock-members";
import type { GroupComment } from "./types";

/**
 * TEMPORARY — stands in for `GET /groups/posts/{id}/comments`. Commenters come
 * from the group's own roster so nobody outside the group appears in a thread.
 */
const author = (groupId: string, index: number) => mockGroupMembers[groupId][index];

export const mockGroupComments: GroupComment[] = [
  {
    id: "gc-001",
    postId: "gp-001",
    parentId: null,
    author: author("grp-001", 3),
    body: "سجّلوني. بكون موجود من ٨:٤٥ إن شاء الله.",
    createdAtLabel: "قبل ساعة",
    likesCount: 12,
    isLiked: false,
  },
  {
    id: "gc-002",
    postId: "gp-001",
    parentId: "gc-001",
    author: author("grp-001", 0),
    body: "تم تسجيلك. الرجاء إحضار قفازات إن توفرت.",
    createdAtLabel: "قبل ٤٠ دقيقة",
    likesCount: 5,
    isLiked: false,
  },
  {
    id: "gc-003",
    postId: "gp-001",
    parentId: null,
    author: author("grp-001", 4),
    body: "في مواصلات مؤمّنة من جهة المزة أو لازم نوصل لحالنا؟",
    createdAtLabel: "قبل ٥٠ دقيقة",
    likesCount: 3,
    isLiked: false,
  },
  {
    id: "gc-004",
    postId: "gp-001",
    parentId: "gc-003",
    author: author("grp-001", 2),
    body: "في باص بينطلق من دوار المزة ٨:٣٠. خبّرنا إذا بدك مقعد.",
    createdAtLabel: "قبل ٣٥ دقيقة",
    likesCount: 9,
    isLiked: true,
  },
  {
    id: "gc-005",
    postId: "gp-003",
    parentId: null,
    author: author("grp-001", 1),
    body: "شغل ممتاز. الله يعطيكم العافية جميعاً.",
    createdAtLabel: "قبل يوم",
    likesCount: 27,
    isLiked: false,
  },
  {
    id: "gc-006",
    postId: "gp-004",
    parentId: null,
    author: author("grp-002", 2),
    body: "بحاجة نسخة. كيف بقدر استلمها؟",
    createdAtLabel: "قبل ساعتين",
    likesCount: 4,
    isLiked: false,
  },
  {
    id: "gc-007",
    postId: "gp-004",
    parentId: "gc-006",
    author: author("grp-002", 0),
    body: "بتقدر تمر على مكتبة الجامعة يوم الأحد، بترك اسمك عند الموظف.",
    createdAtLabel: "قبل ساعة",
    likesCount: 8,
    isLiked: false,
  },
  {
    id: "gc-008",
    postId: "gp-007",
    parentId: null,
    author: author("grp-007", 2),
    body: "هل التقديم مفتوح لخريجي هندسة المعلوماتية فقط؟",
    createdAtLabel: "قبل ٣ ساعات",
    likesCount: 6,
    isLiked: false,
  },
  {
    id: "gc-009",
    postId: "gp-007",
    parentId: "gc-008",
    author: author("grp-007", 0),
    body: "لا، أي اختصاص قريب مقبول شرط وجود مشاريع عملية.",
    createdAtLabel: "قبل ساعتين",
    likesCount: 14,
    isLiked: false,
  },
];
