import { mockGroupMembers } from "./mock-members";
import type { GroupPost } from "./types";

/**
 * TEMPORARY — stands in for `GET /groups/{id}/posts`. Authors are pulled from
 * the group's own mock roster so a post never shows a non-member as its author.
 */
const author = (groupId: string, index: number) => mockGroupMembers[groupId][index];

export const mockGroupPosts: GroupPost[] = [
  {
    id: "gp-001",
    groupId: "grp-001",
    author: author("grp-001", 0),
    body: "حملة تنظيف حديقة تشرين يوم الجمعة ٩ صباحاً. نحتاج ٢٠ متطوع، والأدوات مؤمّنة. سجّل اسمك بالتعليقات.",
    createdAtLabel: "قبل ساعتين",
    likesCount: 84,
    commentsCount: 31,
  },
  {
    id: "gp-002",
    groupId: "grp-001",
    author: author("grp-001", 2),
    body: "تذكير: من سجّل بحملة توزيع السلال الغذائية، نلتقي غداً أمام مقر الجمعية ٨:٣٠. الرجاء الالتزام بالموعد.",
    createdAtLabel: "قبل ٦ ساعات",
    likesCount: 41,
    commentsCount: 12,
  },
  {
    id: "gp-003",
    groupId: "grp-001",
    author: author("grp-001", 3),
    body: "شكراً لكل من شارك بحملة الأسبوع الماضي — وزّعنا ١٤٠ سلة على ٣ أحياء. الصور بالتعليقات.",
    createdAtLabel: "قبل يومين",
    likesCount: 216,
    commentsCount: 47,
  },
  {
    id: "gp-004",
    groupId: "grp-002",
    author: author("grp-002", 0),
    body: "متوفر ٣٠ نسخة من كتاب التحليل الرياضي ١ للسنة الأولى. من بحاجة يراسلني خاص.",
    createdAtLabel: "قبل ٣ ساعات",
    likesCount: 57,
    commentsCount: 24,
  },
  {
    id: "gp-005",
    groupId: "grp-002",
    author: author("grp-002", 1),
    body: "غرفة شاغرة بسكن طلابي قرب الجامعة، مناسبة لطالبين. التفاصيل والسعر بالتعليقات.",
    createdAtLabel: "قبل يوم",
    likesCount: 33,
    commentsCount: 19,
  },
  {
    id: "gp-006",
    groupId: "grp-003",
    author: author("grp-003", 0),
    body: "وصلت دفعة البطانيات الجديدة للمستودع. التوزيع يبدأ الأحد حسب كشوف الأسر المسجّلة.",
    createdAtLabel: "قبل ٤ ساعات",
    likesCount: 129,
    commentsCount: 38,
  },
  {
    id: "gp-007",
    groupId: "grp-007",
    author: author("grp-007", 0),
    body: "مطلوب مهندس برمجيات خريج جديد لشركة في طرطوس — دوام كامل، تدريب أول ٣ أشهر. أرسل سيرتك عبر الرابط بالتعليق.",
    createdAtLabel: "قبل ٥ ساعات",
    likesCount: 92,
    commentsCount: 44,
  },
  {
    id: "gp-008",
    groupId: "grp-007",
    author: author("grp-007", 2),
    body: "دورة مجانية بمهارات المقابلات الوظيفية، عن بعد، تبدأ الاثنين. المقاعد محدودة بـ ٤٠ متدرب.",
    createdAtLabel: "قبل ٣ أيام",
    likesCount: 68,
    commentsCount: 21,
  },
];
