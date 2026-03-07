import type {
  ContactMethod,
  PickupMethod,
  PostStatus,
  PostType,
} from "@/src/types/posts";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const POST_TYPE_OPTIONS: SelectOption<PostType>[] = [
  { value: "offer", label: "عرض" },
  { value: "request", label: "طلب" },
];

export const PICKUP_METHOD_OPTIONS: SelectOption<PickupMethod>[] = [
  { value: "direct", label: "استلام مباشر" },
  { value: "delivery", label: "توصيل متاح" },
  { value: "dropoff", label: "نقطة تسليم" },
];

export const CONTACT_METHOD_OPTIONS: SelectOption<ContactMethod>[] = [
  { value: "phone", label: "هاتف" },
  { value: "whatsapp", label: "واتساب" },
  { value: "both", label: "هاتف + واتساب" },
];

export const POST_CATEGORIES: string[] = [
  "طعام",
  "ملابس",
  "أثاث",
  "أدوية",
  "كتب",
  "أجهزة",
  "أجهزة طبية",
  "خدمات",
  "أخرى",
];

const STATUS_LABELS: Record<PostStatus, string> = {
  pending: "قيد المراجعة",
  published: "منشور/متاح",
  in_progress: "قيد التنسيق",
  completed: "مكتمل",
  rejected: "مرفوض",
  removed: "محذوف/محجوب",
};

const TYPE_LABELS: Record<PostType, string> = {
  offer: "عرض",
  request: "طلب",
};

const STATUS_THEME: Record<PostStatus, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  published: { bg: "#DBEAFE", text: "#1E40AF" },
  in_progress: { bg: "#E0E7FF", text: "#4338CA" },
  completed: { bg: "#DCFCE7", text: "#166534" },
  rejected: { bg: "#FEE2E2", text: "#991B1B" },
  removed: { bg: "#F3F4F6", text: "#374151" },
};

const NEXT_STATUS_MAP: Record<PostStatus, PostStatus[]> = {
  pending: ["published", "rejected"],
  published: ["in_progress", "completed", "removed"],
  in_progress: ["published", "completed"],
  completed: [],
  rejected: ["pending"],
  removed: [],
};

export const getPostStatusLabel = (status: PostStatus): string =>
  STATUS_LABELS[status];

export const getPostTypeLabel = (type: PostType): string => TYPE_LABELS[type];

export const getPostStatusTheme = (status: PostStatus) => STATUS_THEME[status];

export const getNextPostStatuses = (status: PostStatus): PostStatus[] =>
  NEXT_STATUS_MAP[status];

export const formatPostDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("ar-SA");
};

export const parseTagsInput = (raw: string): string[] =>
  raw
    .split(/[,،]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
