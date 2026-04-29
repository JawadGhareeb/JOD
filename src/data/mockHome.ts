import { HomePostTypeEnum } from "@/src/constants/global";
import { HomeFeedPayload, HomePost, HomePostAction, Publisher } from "@/src/types/home";

// Backend-ready mock payload for home feed (20 posts).
const publishers = [
  {
    id: "publisher-1",
    name: "جمعية عطاء",
    username: "ataa.org",
    city: "دمشق",
    bio: "جمعية إنسانية تعمل على دعم الأسر المحتاجة عبر حملات إغاثة دورية ومبادرات تنموية.",
    verified: true,
  },
  {
    id: "publisher-2",
    name: "فريق المتطوعين",
    username: "volunteers.team",
    city: "حلب",
    bio: "فريق شبابي ينسق الفرص التطوعية الميدانية ويركز على الاستجابة السريعة للحالات العاجلة.",
  },
  {
    id: "publisher-3",
    name: "مبادرة يد الخير",
    username: "hand.of.good",
    city: "حمص",
    bio: "مبادرة مجتمع محلي تهدف لربط المتبرعين بالحملات الموثوقة ومتابعة أثر التبرعات بشكل شفاف.",
    verified: true,
  },
  {
    id: "publisher-4",
    name: "أهالي الحي",
    username: "community.group",
    city: "حماة",
    bio: "تجمع أهلي يطلق حملات دعم اجتماعي وصحي للأسر المتعففة داخل الحي والمناطق المجاورة.",
  },
];

const imagePool = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
  "https://images.unsplash.com/photo-1469571486292-b53601020f86",
  "https://images.unsplash.com/photo-1542838132-92c53300491e",
  "https://images.unsplash.com/photo-1593113630400-ea4288922497",
  "https://images.unsplash.com/photo-1524069290683-0457abfe42c3",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
];

type PostTemplate = {
  postType: HomePostTypeEnum;
  content: string;
  cta: HomePostAction;
};

const templates: PostTemplate[] = [
  {
    postType: HomePostTypeEnum.VolunteerOpportunity,
    content:
      "مطلوب 20 متطوع لتنظيم وتوزيع السلال الغذائية يوم الجمعة القادم. باب التسجيل مفتوح حتى مساء الخميس.",
    cta: { type: "apply", label: "قدّم الآن", state: "open" },
  },
  {
    postType: HomePostTypeEnum.DonationCampaign,
    content:
      "حملة جديدة لدعم العمليات الجراحية العاجلة للأطفال، وهدفنا تغطية 30 حالة خلال هذا الشهر.",
    cta: { type: "donate", label: "تبرّع الآن", state: "open" },
  },
  {
    postType: HomePostTypeEnum.HelpRequest,
    content:
      "أسرة مكونة من 6 أفراد تحتاج مساعدة عاجلة لتأمين مستلزمات التدفئة والأدوية خلال هذا الأسبوع.",
    cta: { type: "contact", label: "تواصل", state: "open" },
  },
  {
    postType: HomePostTypeEnum.CampaignUpdate,
    content:
      "تم إنجاز 65% من هدف الحملة خلال 10 أيام فقط. شكرًا لكل شخص ساهم بالنشر أو بالدعم المباشر.",
    cta: { type: "details", label: "عرض التفاصيل", state: "open" },
  },
  {
    postType: HomePostTypeEnum.Awareness,
    content:
      "معلومة مهمة: التبرعات الصغيرة المنتظمة تصنع أثرًا تراكميًا أكبر من التبرعات الموسمية المتقطعة.",
    cta: { type: "none", label: "" },
  },
];

const buildPost = (index: number): HomePost => {
  const template = templates[index % templates.length];
  const publisher = publishers[index % publishers.length];

  const hasTwoImages = index % 6 === 0;
  const hasOneImage = index % 3 === 0;
  const images = hasTwoImages
    ? [imagePool[index % imagePool.length], imagePool[(index + 1) % imagePool.length]]
    : hasOneImage
      ? [imagePool[index % imagePool.length]]
      : [];

  const cta =
    template.postType === HomePostTypeEnum.VolunteerOpportunity && index % 9 === 0
      ? { ...template.cta, state: "submitted" as const, label: "قدّم الآن" }
      : template.postType === HomePostTypeEnum.VolunteerOpportunity && index % 11 === 0
        ? { ...template.cta, state: "closed" as const, label: "اكتمل العدد" }
        : { ...template.cta };

  return {
    id: `post-${index + 1}`,
    publisher,
    postType: template.postType,
    content: template.content,
    createdAt: new Date(Date.now() - index * 1000 * 60 * 47).toISOString(),
    images,
    cta,
    stats: {
      likes: 50 + ((index * 17) % 220),
      comments: 8 + ((index * 7) % 70),
      shares: 3 + ((index * 5) % 35),
    },
    saved: index % 5 === 0,
  };
};

export const mockHomePayload: HomeFeedPayload = {
  posts: Array.from({ length: 20 }, (_, idx) => buildPost(idx)),
};

export function getHomePublisherById(publisherId: string): Publisher | undefined {
  return publishers.find((publisher) => publisher.id === publisherId);
}

export function getHomePostsByPublisherId(publisherId: string): HomePost[] {
  return mockHomePayload.posts.filter((post) => post.publisher.id === publisherId);
}
