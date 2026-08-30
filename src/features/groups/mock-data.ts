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
    rules: [
      "احترم جميع الأعضاء وتجنّب أي إساءة أو تنمّر.",
      "لا تنشر طلبات تبرع مالي شخصية داخل المجموعة.",
      "التزم بمواعيد الحملات التي تسجّل فيها.",
    ],
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
    rules: [
      "المحتوى المسموح: مواد دراسية وفرص سكن ودعم طلابي فقط.",
      "لا تشارك بيانات طلاب آخرين دون إذنهم.",
      "ممنوع بيع الكتب بأسعار مضاعفة.",
    ],
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
    rules: [
      "التوزيع يتم عبر المنظمة حصراً — لا تنسيق فردي.",
      "لا تنشر صور المستفيدين أو أسماءهم.",
      "بلّغ عن أي طلب تبرع مشبوه فوراً.",
    ],
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
    rules: [
      "المنشورات مخصّصة للمنتجات المنزلية فقط.",
      "اذكر السعر بوضوح ولا تبالغ في الوصف.",
      "ممنوع التسويق لجهات تجارية كبيرة.",
    ],
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
    rules: [
      "حافظ على سرّية أي معلومة صحية تطّلع عليها.",
      "لا تقدّم استشارات طبية إن لم تكن مختصاً.",
      "ممنوع نشر أسماء المرضى أو صورهم.",
    ],
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
    rules: [
      "بيانات الأطفال والأسر سرّية ولا تُنشر خارج المجموعة.",
      "التواصل مع الأسر يتم عبر المشرفين فقط.",
      "الكفالة التزام طويل — لا تسجّل إن لم تكن قادراً على الاستمرار.",
    ],
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
    rules: [
      "انشر إعلانات وظائف حقيقية فقط مع تفاصيل واضحة.",
      "ممنوع طلب أي رسوم من المتقدمين.",
      "لا تنشر بيانات التواصل الشخصية للآخرين.",
    ],
  },
];

export const mockMyGroups = GROUPS.filter((group) => group.isMember);

/** Suggested: not joined yet, most active first. */
export const mockSuggestedGroups = GROUPS.filter((group) => !group.isMember)
  .slice()
  .sort((a, b) => b.postsThisWeek - a.postsThisWeek);

/** Discover: everything browsable, largest communities first. */
export const mockDiscoverGroups = GROUPS.slice().sort((a, b) => b.membersCount - a.membersCount);
