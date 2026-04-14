import type { PostItem } from "@/src/types/posts";

export const mockPosts: PostItem[] = [
  {
    id: "p-1",
    ownerId: "me",
    title: "تحديث حملة الغذاء",
    description:
      "وصلنا إلى 35% من الهدف خلال الأسبوع الأول. شكرًا لكل من ساهم بالدعم.",
    type: "offer",
    status: "published",
    category: "تبرعات",
    tags: ["تبرع", "حملات"],
    city: "دمشق",
    area: "المالكي",
    pickupMethod: "delivery",
    contactMethod: "both",
    createdAt: "2026-04-12T10:20:00.000Z",
  },
  {
    id: "p-2",
    ownerId: "publisher-1",
    title: "فرصة تطوع قادمة",
    description: "مطلوب متطوعون لتنظيم نقطة توزيع يوم الجمعة القادم.",
    type: "request",
    status: "published",
    category: "تطوع",
    tags: ["تطوع"],
    city: "حلب",
    area: "الجميلية",
    pickupMethod: "direct",
    contactMethod: "phone",
    createdAt: "2026-04-10T14:00:00.000Z",
  },
  {
    id: "p-3",
    ownerId: "publisher-2",
    title: "احتياج مستلزمات مدرسية",
    description: "نحتاج حقائب مدرسية ودفاتر لـ 60 طالب.",
    type: "request",
    status: "in_progress",
    category: "تعليم",
    tags: ["تعليم", "دعم"],
    city: "حمص",
    pickupMethod: "dropoff",
    contactMethod: "whatsapp",
    createdAt: "2026-04-08T08:30:00.000Z",
  },
];

export const mockSavedPostIds: string[] = ["p-2"];
