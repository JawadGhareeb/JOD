import type {
  DonationCampaign,
  JobItem,
  VolunteeringCampaign,
} from "@/src/types/models";

export const mockDonationCampaigns: DonationCampaign[] = [
  {
    id: "d-1",
    title: "سلال غذائية للأسر المتعففة",
    description: "حملة لتأمين احتياجات غذائية شهرية لـ 200 أسرة.",
    orgName: "جمعية عطاء",
    verified: true,
    city: "دمشق",
    endDate: "2026-05-10",
    goalAmount: 500000,
    raisedAmount: 174000,
    statusTag: "باقي 25 أيام",
    publisherId: "publisher-1",
  },
  {
    id: "d-2",
    title: "دعم علاج الحالات الطارئة",
    description: "تغطية تكاليف طبية عاجلة للحالات ذات الدخل المحدود.",
    orgName: "فريق الاستجابة",
    verified: true,
    city: "حلب",
    endDate: "2026-04-28",
    goalAmount: 300000,
    raisedAmount: 92000,
    statusTag: "باقي 13 أيام",
    publisherId: "me",
  },
];

export const mockVolunteeringCampaigns: VolunteeringCampaign[] = [
  {
    id: "v-1",
    title: "تنظيم طرود رمضان",
    description: "فرصة تطوع ليوم واحد لتجهيز وتوزيع طرود غذائية.",
    city: "دمشق",
    date: "2026-04-20",
    time: "04:00 م",
    requiredVolunteers: 40,
    joinedVolunteers: 19,
    statusTag: "باقي 5 أيام",
    publisherId: "me",
  },
  {
    id: "v-2",
    title: "دعم مراكز الإيواء",
    description: "مطلوب متطوعون للمساندة اللوجستية والإرشاد.",
    city: "حمص",
    date: "2026-04-25",
    time: "10:00 ص",
    requiredVolunteers: 25,
    joinedVolunteers: 7,
    statusTag: "باقي 10 أيام",
    publisherId: "publisher-2",
  },
];

export const mockJobs: JobItem[] = [
  {
    id: "j-1",
    title: "منسق حملات رقمية",
    description: "متابعة حملات التبرع والتقارير والتحليل.",
    orgName: "منصة جود",
    city: "دمشق",
    workType: "دوام كامل",
    experienceYears: 2,
    postedAt: "منذ يوم",
    statusTag: "باقي 20 أيام",
    publisherId: "me",
  },
  {
    id: "j-2",
    title: "أخصائي تواصل مجتمعي",
    description: "إدارة العلاقة مع المتطوعين والجهات الداعمة.",
    orgName: "مبادرة الأمل",
    city: "حماة",
    workType: "دوام جزئي",
    experienceYears: 1,
    postedAt: "منذ 3 أيام",
    statusTag: "باقي 14 أيام",
    publisherId: "publisher-3",
  },
];
