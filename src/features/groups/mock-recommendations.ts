import type { GroupRecommendation } from "./types";

/**
 * TEMPORARY — stands in for `GET /groups/{id}/recommendations`.
 *
 * Keyed by the group's *category*, because that is what the recommendation is
 * based on: a member sees this because of the group they are in, not because of
 * anything the platform knows about them personally. `reason` is filled in by
 * the store, which is the only place that knows the group being viewed.
 */
type SeedRecommendation = Omit<GroupRecommendation, "reason">;

export const mockRecommendationsByCategory: Record<string, SeedRecommendation[]> = {
  تطوع: [
    {
      id: "rec-vol-1",
      kind: "opportunity",
      title: "متطوعون لتأهيل مدرسة الشهيد باسل",
      subtitle: "جمعية البركة",
      category: "تطوع",
      location: "دمشق",
      metaLabel: "١٢ مقعد متبقٍ",
    },
    {
      id: "rec-vol-2",
      kind: "campaign",
      title: "حملة إفطار الصائم الميدانية",
      subtitle: "مؤسسة عطاء",
      category: "تطوع",
      location: "حلب",
      metaLabel: "٦ أيام متبقية",
    },
  ],
  تعليم: [
    {
      id: "rec-edu-1",
      kind: "opportunity",
      title: "مدرّسون متطوعون لمواد الشهادة الثانوية",
      subtitle: "مبادرة نور",
      category: "تعليم",
      location: "حلب",
      metaLabel: "٨ مقاعد متبقية",
    },
    {
      id: "rec-edu-2",
      kind: "campaign",
      title: "تأمين قرطاسية لـ ٥٠٠ طالب",
      subtitle: "جمعية الرسالة",
      category: "تعليم",
      location: "دمشق",
      metaLabel: "٪٦٤ من الهدف",
    },
  ],
  إغاثة: [
    {
      id: "rec-rel-1",
      kind: "campaign",
      title: "كسوة الشتاء للأسر النازحة",
      subtitle: "مؤسسة عطاء",
      category: "إغاثة",
      location: "إدلب",
      metaLabel: "٣ أيام متبقية",
    },
    {
      id: "rec-rel-2",
      kind: "opportunity",
      title: "متطوعون لفرز وتغليف المساعدات",
      subtitle: "الهلال الأحمر",
      category: "إغاثة",
      location: "إدلب",
      metaLabel: "٢٥ مقعد متبقٍ",
    },
  ],
  صحة: [
    {
      id: "rec-hea-1",
      kind: "campaign",
      title: "تجهيز عيادة متنقلة للأرياف",
      subtitle: "الهلال الطبي",
      category: "صحة",
      location: "حمص",
      metaLabel: "٪٤١ من الهدف",
    },
    {
      id: "rec-hea-2",
      kind: "opportunity",
      title: "كوادر تمريض للأيام الطبية المجانية",
      subtitle: "الهلال الطبي",
      category: "صحة",
      location: "حمص",
      metaLabel: "١٠ مقاعد متبقية",
    },
  ],
  كفالات: [
    {
      id: "rec-spo-1",
      kind: "campaign",
      title: "كفالة ٢٠٠ يتيم لمدة سنة",
      subtitle: "جمعية البركة",
      category: "كفالات",
      location: "دمشق",
      metaLabel: "٪٧٨ من الهدف",
    },
    {
      id: "rec-spo-2",
      kind: "opportunity",
      title: "زيارات متابعة دورية للأسر المكفولة",
      subtitle: "جمعية البركة",
      category: "كفالات",
      location: "دمشق",
      metaLabel: "٦ مقاعد متبقية",
    },
  ],
  توظيف: [
    {
      id: "rec-job-1",
      kind: "opportunity",
      title: "تدريب صيفي مدفوع — تطوير ويب",
      subtitle: "شركة أفق التقنية",
      category: "توظيف",
      location: "طرطوس",
      metaLabel: "١٥ مقعد متبقٍ",
    },
    {
      id: "rec-job-2",
      kind: "opportunity",
      title: "ورشة كتابة السيرة الذاتية للخريجين",
      subtitle: "مركز التمكين المهني",
      category: "توظيف",
      location: "اللاذقية",
      metaLabel: "٤٠ مقعد متبقٍ",
    },
  ],
  "تمكين اقتصادي": [
    {
      id: "rec-eco-1",
      kind: "campaign",
      title: "قروض حسنة لمشاريع الأسر المنتجة",
      subtitle: "صندوق البادرة",
      category: "تمكين اقتصادي",
      location: "اللاذقية",
      metaLabel: "٪٥٢ من الهدف",
    },
    {
      id: "rec-eco-2",
      kind: "opportunity",
      title: "معرض تسويقي للمنتجات المنزلية",
      subtitle: "غرفة تجارة اللاذقية",
      category: "تمكين اقتصادي",
      location: "اللاذقية",
      metaLabel: "٣٠ مقعد متبقٍ",
    },
  ],
};

/** Shown when the group's category has nothing curated behind it. */
export const fallbackRecommendations: SeedRecommendation[] = [
  {
    id: "rec-gen-1",
    kind: "opportunity",
    title: "فرص تطوع مفتوحة هذا الشهر",
    subtitle: "منصة جود",
    category: "أخرى",
    location: "كل المحافظات",
    metaLabel: null,
  },
];
