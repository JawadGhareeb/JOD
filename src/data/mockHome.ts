import { HomeFeedPayload } from "@/src/types/home";

// This mock mirrors a backend payload shape to simplify BE wiring later.
export const mockHomePayload: HomeFeedPayload = {
  posts: [
    {
      id: "post-1",
      publisher: {
        id: "publisher-1",
        name: "جمعية عطاء",
        username: "ataa.org",
        verified: true,
      },
      content:
        "تم تجهيز 150 سلة غذائية اليوم، ونحتاج دعم إضافي للوصول إلى 250 سلة قبل نهاية الأسبوع.",
      createdAt: "2026-04-14T09:20:00.000Z",
      images: [
        "https://images.unsplash.com/photo-1542838132-92c53300491e",
        "https://images.unsplash.com/photo-1469571486292-b53601020f86",
      ],
      stats: { likes: 124, comments: 32, shares: 18 },
      saved: false,
    },
    {
      id: "post-2",
      publisher: {
        id: "publisher-2",
        name: "فريق المتطوعين",
        username: "volunteers.team",
      },
      content:
        "مطلوب 20 متطوع لتجهيز وتغليف المساعدات يوم الجمعة. التسجيل مفتوح حتى الخميس مساءً.",
      createdAt: "2026-04-13T14:10:00.000Z",
      images: [],
      stats: { likes: 87, comments: 21, shares: 9 },
      saved: true,
    },
  ],
};
