const SYRIAN_LOCATION_LABELS: Record<string, string> = {
  damascus: "دمشق",
  city_damascus: "دمشق",
  "rif dimashq": "ريف دمشق",
  rif_dimashq: "ريف دمشق",
  city_rif_dimashq: "ريف دمشق",
  aleppo: "حلب",
  city_aleppo: "حلب",
  homs: "حمص",
  city_homs: "حمص",
  hama: "حماة",
  city_hama: "حماة",
  latakia: "اللاذقية",
  city_latakia: "اللاذقية",
  tartus: "طرطوس",
  city_tartus: "طرطوس",
  idlib: "إدلب",
  city_idlib: "إدلب",
  "deir ez-zor": "دير الزور",
  deir_ez_zor: "دير الزور",
  city_deir_ez_zor: "دير الزور",
  raqqa: "الرقة",
  city_raqqa: "الرقة",
  hasakah: "الحسكة",
  city_hasakah: "الحسكة",
  daraa: "درعا",
  city_daraa: "درعا",
  "as-suwayda": "السويداء",
  as_suwayda: "السويداء",
  city_as_suwayda: "السويداء",
  quneitra: "القنيطرة",
  city_quneitra: "القنيطرة",
};

const CATEGORY_LABELS: Record<string, string> = {
  health: "الصحة والعلاج",
  healthcare: "الصحة والعلاج",
  medical: "الصحة والعلاج",
  education: "التعليم",
  food: "الغذاء",
  emergency: "الطوارئ",
  shelter: "الإيواء",
  housing: "الإيواء",
  employment: "التوظيف",
  jobs: "التوظيف",
  volunteer: "التطوع",
  volunteering: "التطوع",
  donation: "التبرعات",
  donations: "التبرعات",
  community: "مجتمعية",
  transport: "النقل",
  transportation: "النقل",
};

export const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  donation: "تبرع",
  help: "مساعدة",
  campaign: "حملة",
  applicant: "تطوع",
  post: "منشور",
  report: "بلاغ",
  account: "الحساب والمنظمة",
  group: "فريق تطوعي",
  staff: "الموظفون",
  system: "النظام",
};

export const NOTIFICATION_EVENT_LABELS: Record<string, string> = {
  "donation.intent_created": "تم تسجيل طلب التبرع",
  "donation.accepted": "تم قبول طلب التبرع",
  "donation.contact_started": "بدأ التواصل بخصوص التبرع",
  "donation.agreed": "تم الاتفاق على التبرع",
  "donation.completed": "تم تأكيد استلام التبرع",
  "donation.cancelled": "تم إلغاء طلب التبرع",
  "donation.received": "تم استلام تبرع",
  "help_offer.created": "عرض مساعدة جديد",
  "help_offer.accepted": "تم قبول عرض المساعدة",
  "help_offer.rejected": "تم رفض عرض المساعدة",
  "help_offer.contact_started": "بدأ التواصل بخصوص المساعدة",
  "help_offer.agreed": "تم الاتفاق على المساعدة",
  "help_offer.helper_confirmed": "أكد المساعد التنفيذ",
  "help_offer.receiver_confirmed": "أكد المستفيد الاستلام",
  "help_offer.completed": "اكتملت المساعدة",
  "help_offer.cancelled": "تم إلغاء المساعدة",
  "help_request.fulfilled": "تمت تلبية طلب المساعدة",
  "help_request.reopened": "أعيد فتح طلب المساعدة",
  "campaign.goal_reached": "وصلت الحملة إلى هدفها",
  "campaign.closing_soon": "الحملة تقترب من الإغلاق",
  "campaign.closed": "تم إغلاق الحملة",
  "campaign.published": "تم نشر الحملة",
  "application.submitted": "تم إرسال طلب التطوع",
  "application.accepted": "تم قبول طلب التطوع",
  "application.contact_started": "بدأ التواصل بخصوص التطوع",
  "application.completed": "اكتملت المشاركة التطوعية",
  "application.rejected": "تم رفض طلب التطوع",
  "application.withdrawn": "تم سحب طلب التطوع",
  "post.submitted": "تم إرسال المنشور للمراجعة",
  "post.published": "تمت الموافقة على المنشور",
  "post.blocked": "تم حظر المنشور",
  "media.published": "تم نشر وسائط جديدة",
  "report.submitted": "تم إرسال البلاغ",
  "report.in_progress": "البلاغ قيد المعالجة",
  "report.closed": "تم إغلاق البلاغ",
  "organization.submitted": "تم إرسال المنظمة للمراجعة",
  "organization.approved": "تمت الموافقة على المنظمة",
  "organization.rejected": "تم رفض المنظمة",
  "group.submitted": "تم إرسال الفريق للمراجعة",
  "group.approved": "تمت الموافقة على الفريق",
  "group.rejected": "تم رفض الفريق",
  "group.role_changed": "تم تغيير دورك في الفريق",
  "group.member_removed": "تمت إزالة عضو من الفريق",
  "group.invitation_created": "دعوة جديدة إلى فريق تطوعي",
  "group.invitation_accepted": "تم قبول دعوة الفريق",
  "group.invitation_declined": "تم رفض دعوة الفريق",
  "group_post.review_requested": "منشور فريق بانتظار المراجعة",
  "group_post.approved": "تمت الموافقة على منشور الفريق",
  "group_post.rejected": "تم رفض منشور الفريق",
  "staff.invited": "دعوة جديدة للانضمام إلى فريق المنظمة",
  "staff.role_changed": "تم تغيير دور الموظف",
  "staff.removed": "تمت إزالة الموظف",
  "system.announcement": "إعلان من جود",
  "system.maintenance": "صيانة النظام",
};

const DONATION_CONTACT_METHOD_LABELS: Record<string, string> = {
  phone: "اتصال هاتفي",
  whatsapp: "واتساب",
  email: "بريد إلكتروني",
  other: "طريقة أخرى",
};

const DONATION_PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "تحويل بنكي",
  cash: "نقدي",
  other: "طريقة أخرى",
};

const ARABIC_PATTERN = /[\u0600-\u06FF]/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TECHNICAL_REFERENCE_PATTERN = /^[a-z0-9]+(?:[_-][a-z0-9]+)+$/i;

function normalizedKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function formatWesternNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatWesternAmount(value: number): string {
  return `${formatWesternNumber(value, { maximumFractionDigits: 2 })} ل.س`;
}

export function localizeSyrianLocation(value: string | null | undefined): string {
  if (!value) return "";
  if (ARABIC_PATTERN.test(value)) return value;
  const key = normalizedKey(value);
  return SYRIAN_LOCATION_LABELS[key] ?? SYRIAN_LOCATION_LABELS[key.replace(/-/g, "_")] ?? value;
}

export function localizeCategoryName(value: string | null | undefined): string {
  if (!value) return "";
  if (ARABIC_PATTERN.test(value)) return value;
  const key = normalizedKey(value).replace(/[_-]+/g, " ");
  return CATEGORY_LABELS[key] ?? CATEGORY_LABELS[key.split(" ")[0]] ?? value;
}

export function notificationCategoryLabel(value: string | null | undefined): string {
  if (!value) return "-";
  return NOTIFICATION_CATEGORY_LABELS[value] ?? value;
}

export function notificationEventLabel(value: string | null | undefined): string {
  if (!value) return "";
  return NOTIFICATION_EVENT_LABELS[value] ?? value;
}

export function notificationReferenceLabel(input: {
  referenceLabel?: string | null;
  actionLabel?: string | null;
  action?: { label?: string | null } | null;
  eventType?: string | null;
  category?: string | null;
}): string | null {
  const raw = input.referenceLabel ?? input.actionLabel ?? input.action?.label ?? null;
  if (!raw) return null;
  const trimmed = raw.trim();
  if (ARABIC_PATTERN.test(trimmed)) return trimmed;

  const isTechnical =
    UUID_PATTERN.test(trimmed) ||
    TECHNICAL_REFERENCE_PATTERN.test(trimmed) ||
    /^app[_-]?\d+$/i.test(trimmed) ||
    /^post[_-]/i.test(trimmed) ||
    /^offer[_-]/i.test(trimmed);

  if (!isTechnical) return trimmed;
  const eventLabel = input.eventType ? NOTIFICATION_EVENT_LABELS[input.eventType] : null;
  if (eventLabel) return eventLabel;
  return input.category ? NOTIFICATION_CATEGORY_LABELS[input.category] ?? null : null;
}

export function donationContactMethodLabel(value: string | null | undefined): string {
  if (!value) return "-";
  return DONATION_CONTACT_METHOD_LABELS[value] ?? value;
}

export function donationPaymentMethodLabel(value: string | null | undefined): string {
  if (!value) return "-";
  return DONATION_PAYMENT_METHOD_LABELS[value] ?? value;
}
