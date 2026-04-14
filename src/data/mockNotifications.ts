import type { NotificationType, NotificationsPayload } from "@/src/types/notifications";

type NotificationTemplate = {
  type: NotificationType;
  title: string;
  body: string;
  actionLabel?: string;
};

const notificationTemplates: NotificationTemplate[] = [
  {
    type: "campaign",
    title: "تحديث على حملة قيد المتابعة",
    body: "تم الوصول إلى 70% من هدف الحملة التي تتابعها.",
    actionLabel: "عرض الحملة",
  },
  {
    type: "volunteer",
    title: "قبول طلب التطوع",
    body: "تم قبول طلبك للمشاركة في نشاط يوم الجمعة.",
    actionLabel: "تفاصيل النشاط",
  },
  {
    type: "comment",
    title: "تعليق جديد على منشورك",
    body: "أضاف أحد المستخدمين تعليقًا جديدًا على منشورك.",
    actionLabel: "عرض التعليق",
  },
  {
    type: "saved",
    title: "تذكير بالمنشور المحفوظ",
    body: "المنشور الذي حفظته سابقًا تم تحديثه بمعلومات جديدة.",
    actionLabel: "فتح المنشور",
  },
  {
    type: "system",
    title: "إشعار من المنصة",
    body: "تم تحسين تجربة الصفحة الرئيسية وإضافة تصنيفات جديدة للمحتوى.",
  },
] as const;

export const mockNotificationsPayload: NotificationsPayload = {
  notifications: Array.from({ length: 18 }, (_, index) => {
    const template = notificationTemplates[index % notificationTemplates.length];

    return {
      id: `notification-${index + 1}`,
      type: template.type,
      title: template.title,
      body: template.body,
      actionLabel: template.actionLabel,
      createdAt: new Date(Date.now() - index * 1000 * 60 * 45).toISOString(),
      isRead: index > 4,
    };
  }),
};
