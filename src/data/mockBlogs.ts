import type { BlogCategory, BlogsPayload } from "@/src/types/blogs";

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  all: "الكل",
  awareness: "توعية",
  success_stories: "قصص نجاح",
  campaign_updates: "تحديثات الحملات",
  volunteer_guides: "دليل التطوع",
};

const blogCovers = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
  "https://images.unsplash.com/photo-1593113630400-ea4288922497",
  "https://images.unsplash.com/photo-1469571486292-b53601020f86",
  "https://images.unsplash.com/photo-1524069290683-0457abfe42c3",
  "https://images.unsplash.com/photo-1542838132-92c53300491e",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
];

const categories: Exclude<BlogCategory, "all">[] = [
  "awareness",
  "success_stories",
  "campaign_updates",
  "volunteer_guides",
];

const titles = [
  "كيف نتحقق من مصداقية الحملات قبل التبرع؟",
  "قصة نجاح: حملة علاج الطفل سامر",
  "تقرير الإنجاز الشهري لحملة السلال الغذائية",
  "دليل المتطوع الجديد: أول أسبوع ميداني",
  "أفضل 5 طرق لنشر حملة إنسانية بشكل صحيح",
  "كيف تصيغ منشور مساعدة واضح ويصل للناس؟",
  "رحلة متطوعة: من أول تسجيل إلى قيادة فريق",
  "ما الفرق بين التبرع الشهري والتبرع الموسمي؟",
  "تحديث: اكتمال المرحلة الأولى من حملة الشتاء",
  "دليل مبسط لإدارة وقتك كمتطوع جامعي",
  "الأثر الحقيقي للتبرعات الصغيرة المنتظمة",
  "كيف نكتب تحديثات حملات تبني الثقة؟",
];

const excerpts = [
  "خطوات عملية للتأكد من الجهات الناشرة، مراجعة الشفافية المالية، ومتابعة التقارير الدورية قبل اتخاذ قرار التبرع.",
  "خلال 3 أسابيع تم تأمين كامل تكلفة العلاج بفضل 420 مساهمة. في هذا المقال نعرض ما الذي نجح في الحملة.",
  "نسبة الإنجاز، عدد المستفيدين، وخطة المرحلة القادمة ضمن تقرير واضح يساعد الداعمين على متابعة الأثر.",
  "نصائح أساسية للتعامل مع الفريق والمستفيدين، وآلية الالتزام والتوثيق خلال النشاطات التطوعية.",
];

export const mockBlogsPayload: BlogsPayload = {
  posts: titles.map((title, index) => ({
    id: `blog-${index + 1}`,
    title,
    excerpt: excerpts[index % excerpts.length],
    coverImage: blogCovers[index % blogCovers.length],
    category: categories[index % categories.length],
    readTimeMinutes: 3 + (index % 5),
    publishedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 6).toISOString(),
    author: {
      id: `author-${(index % 4) + 1}`,
      name: ["جمعية جود", "فريق المتطوعين", "مبادرة يد الخير", "قسم المحتوى"][index % 4],
      username: ["jod.org", "volunteers.team", "good.hand", "jod.content"][index % 4],
      verified: index % 2 === 0,
    },
  })),
};
