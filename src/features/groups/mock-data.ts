import type { Group } from "./types";

/**
 * TEMPORARY — replace with the real API once the groups endpoints land.
 * Keep the shape in sync with `Group` so only this file needs deleting.
 */
const GROUPS: Group[] = [
  {
    id: "grp-001",
    name: "متطوعو دمشق",
    description: "تنسيق حملات التطوع الميداني داخل دمشق وريفها، ومشاركة الفرص الأسبوعية.",
    category: "تطوع",
    location: "دمشق",
    visibility: "public",
    membersCount: 2431,
    postsThisWeek: 18,
    isMember: true,
    organizationName: "جمعية البركة",
    isVerifiedOrganization: true,
  },
  {
    id: "grp-002",
    name: "دعم طلاب الجامعات",
    description: "مساعدات دراسية، كتب مستعملة، وفرص سكن للطلاب الجامعيين.",
    category: "تعليم",
    location: "حلب",
    visibility: "public",
    membersCount: 1876,
    postsThisWeek: 24,
    isMember: true,
    organizationName: null,
    isVerifiedOrganization: false,
  },
  {
    id: "grp-003",
    name: "إغاثة الشتاء",
    description: "توزيع البطانيات والمدافئ والملابس الشتوية على الأسر الأكثر حاجة.",
    category: "إغاثة",
    location: "إدلب",
    visibility: "public",
    membersCount: 5209,
    postsThisWeek: 41,
    isMember: false,
    organizationName: "مؤسسة عطاء",
    isVerifiedOrganization: true,
  },
  {
    id: "grp-004",
    name: "الأسر المنتجة",
    description: "تسويق منتجات الأسر المنتجة ودعم المشاريع الصغيرة المنزلية.",
    category: "تمكين اقتصادي",
    location: "اللاذقية",
    visibility: "public",
    membersCount: 934,
    postsThisWeek: 7,
    isMember: false,
    organizationName: null,
    isVerifiedOrganization: false,
  },
  {
    id: "grp-005",
    name: "رعاية صحية مجانية",
    description: "مواعيد العيادات المجانية والحملات الطبية والتبرع بالأدوية.",
    category: "صحة",
    location: "حمص",
    visibility: "private",
    membersCount: 1425,
    postsThisWeek: 12,
    isMember: false,
    organizationName: "الهلال الطبي",
    isVerifiedOrganization: true,
  },
  {
    id: "grp-006",
    name: "كفالة الأيتام",
    description: "ربط الكافلين بالأسر المحتاجة ومتابعة حالات الأطفال الأيتام.",
    category: "كفالات",
    location: "دمشق",
    visibility: "private",
    membersCount: 3102,
    postsThisWeek: 9,
    isMember: false,
    organizationName: "جمعية البركة",
    isVerifiedOrganization: true,
  },
  {
    id: "grp-007",
    name: "فرص عمل للشباب",
    description: "إعلانات وظائف وتدريبات مهنية موجهة للخريجين الجدد.",
    category: "توظيف",
    location: "طرطوس",
    visibility: "public",
    membersCount: 612,
    postsThisWeek: 15,
    isMember: false,
    organizationName: null,
    isVerifiedOrganization: false,
  },
];

export const mockMyGroups = GROUPS.filter((group) => group.isMember);

/** Suggested: not joined yet, most active first. */
export const mockSuggestedGroups = GROUPS.filter((group) => !group.isMember)
  .slice()
  .sort((a, b) => b.postsThisWeek - a.postsThisWeek);

/** Discover: everything browsable, largest communities first. */
export const mockDiscoverGroups = GROUPS.slice().sort((a, b) => b.membersCount - a.membersCount);
