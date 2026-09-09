export const APP_ERROR_MESSAGES = {
  generic: "حدث خطأ غير متوقع. حاول مرة أخرى.",
  network: "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.",
  server: "حدث خطأ في الخادم. حاول مرة أخرى بعد قليل.",
  unauthorized: "انتهت جلسة تسجيل الدخول. سجّل الدخول من جديد.",
  forbidden: "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
  notFound: "العنصر المطلوب غير موجود.",
  conflict: "تعذر تنفيذ الطلب بسبب تعارض في البيانات.",
  validation: "يرجى التحقق من البيانات المدخلة.",
  tooManyRequests: "تم إجراء محاولات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.",
  auth: {
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    accountInactive: "هذا الحساب غير مفعّل. تواصل مع الإدارة.",
    organizationInactive: "حساب المنظمة غير مفعّل أو غير موثّق بعد.",
    verificationRequired: "يجب تأكيد الحساب قبل تسجيل الدخول.",
    invalidVerificationCode: "رمز التحقق غير صحيح أو منتهي الصلاحية.",
    verificationCodeExpired: "انتهت صلاحية رمز التحقق. اطلب رمزاً جديداً.",
    verificationAttemptsExceeded: "تم تجاوز عدد محاولات التحقق المسموح بها. اطلب رمزاً جديداً.",
    verificationThrottled: "يرجى الانتظار قليلاً قبل طلب رمز تحقق جديد.",
    accountAlreadyVerified: "الحساب مفعّل مسبقاً. يمكنك تسجيل الدخول.",
    verifyAccount: "تعذر التحقق من الرمز. حاول مرة أخرى.",
    resendVerification: "تعذر إعادة إرسال رمز التحقق. حاول مرة أخرى.",
  },
  posts: {
    create: "تعذر إنشاء المنشور. تحقق من البيانات وحاول مرة أخرى.",
    publish: "تعذر إرسال المنشور. تحقق من البيانات والصور وحاول مرة أخرى.",
    saveDraft: "تعذر حفظ المسودة. تحقق من البيانات والصور وحاول مرة أخرى.",
    delete: "تعذر حذف المنشور. حاول مرة أخرى.",
    deleteImage: "تعذر حذف الصورة. حاول مرة أخرى.",
    deleteImageMissing: "تعذر العثور على بيانات الصورة المرفوعة. حدّث المنشور وحاول مرة أخرى.",
  },
  groups: {
    create: "تعذر إرسال طلب إنشاء الفريق. تحقق من البيانات وحاول مجدداً.",
    invalidForm: "راجع الحقول المطلوبة والمحددة باللون الأحمر.",
    createCampaign: "تعذر إنشاء حملة الفريق. حاول مرة أخرى.",
  },
  applications: {
    submit: "تعذر إرسال طلب التطوع. تحقق من البيانات وحاول مرة أخرى.",
    withdraw: "تعذر سحب طلب التطوع. حاول مرة أخرى.",
  },
  donations: {
    submit: "تعذر إرسال طلب التبرع. تحقق من البيانات وحاول مرة أخرى.",
    action: "تعذر تنفيذ إجراء التبرع. حدّث البيانات وحاول مجدداً.",
  },
  helpOffers: {
    submit: "تعذر إرسال عرض المساعدة. تحقق من البيانات وحاول مرة أخرى.",
    action: "تعذر تنفيذ الإجراء على عرض المساعدة. حدّث البيانات وحاول مجدداً.",
  },
  profile: {
    update: "تعذر حفظ معلومات الحساب. حاول مرة أخرى.",
    deletePost: "تعذر حذف المنشور. حاول مرة أخرى.",
    updateAvatar: "تعذر تحديث صورة الملف الشخصي. حاول مرة أخرى.",
    deleteAvatar: "تعذر حذف صورة الملف الشخصي. حاول مرة أخرى.",
  },
  preferences: {
    update: "تعذر تحديث التفضيلات. حاول مرة أخرى.",
    save: "تعذر حفظ التفضيلات. بقيت اختياراتك محفوظة على الشاشة للمحاولة مجدداً.",
  },
  password: {
    sendCode: "تعذر إرسال رمز التحقق. حاول مرة أخرى.",
    update: "تعذر تغيير كلمة المرور. تحقق من البيانات وحاول مرة أخرى.",
  },
} as const;

export const FORM_ERROR_MESSAGES = {
  requiredFields: "راجع الحقول المطلوبة والمحددة باللون الأحمر.",
  emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
  phoneInvalid: "أدخل رقم موبايل سوري صحيحاً: 9 أرقام بعد +963، من دون صفر في البداية.",
  group: {
    nameMin: "اسم الفريق يجب أن يكون 3 أحرف على الأقل",
    nameMax: "اسم الفريق يجب ألا يتجاوز 120 حرفاً",
    descriptionMin: "وصف الفريق يجب أن يكون 10 أحرف على الأقل",
    descriptionMax: "وصف الفريق يجب ألا يتجاوز 2000 حرف",
    purposeMin: "هدف إنشاء الفريق يجب أن يكون 10 أحرف على الأقل",
    purposeMax: "هدف إنشاء الفريق يجب ألا يتجاوز 1000 حرف",
    locationRequired: "المحافظة مطلوبة",
    locationInvalid: "اختر محافظة سورية صحيحة",
    categoryRequired: "اختر توجهاً واحداً على الأقل",
    categoryMax: "يمكن اختيار 8 توجهات كحد أقصى",
    ruleRequired: "القانون مطلوب",
    ruleMaxLength: "القانون يجب ألا يتجاوز 300 حرف",
    rulesRequired: "أضف قانوناً واحداً على الأقل",
    rulesMax: "يمكن إضافة 20 قانوناً كحد أقصى",
    inviteRequired: "اختر مستخدماً واحداً على الأقل لدعوته",
    inviteMax: "يمكن دعوة 30 مستخدماً كحد أقصى",
    imageRequired: "شعار الفريق مطلوب",
  },
} as const;

const ARABIC_TEXT_PATTERN = /[\u0600-\u06FF]/;

const ERROR_CODE_MESSAGES: Record<string, string> = {
  account_inactive: APP_ERROR_MESSAGES.auth.accountInactive,
  organization_inactive: APP_ERROR_MESSAGES.auth.organizationInactive,
  invalid_credentials: APP_ERROR_MESSAGES.auth.invalidCredentials,
  verification_required: APP_ERROR_MESSAGES.auth.verificationRequired,
  invalid_verification_code: APP_ERROR_MESSAGES.auth.invalidVerificationCode,
  verification_code_expired: APP_ERROR_MESSAGES.auth.verificationCodeExpired,
  verification_attempts_exceeded: APP_ERROR_MESSAGES.auth.verificationAttemptsExceeded,
  verification_throttled: APP_ERROR_MESSAGES.auth.verificationThrottled,
  account_already_verified: APP_ERROR_MESSAGES.auth.accountAlreadyVerified,
  unauthenticated: APP_ERROR_MESSAGES.unauthorized,
  unauthorized: APP_ERROR_MESSAGES.forbidden,
  forbidden: APP_ERROR_MESSAGES.forbidden,
  not_found: APP_ERROR_MESSAGES.notFound,
  validation_error: APP_ERROR_MESSAGES.validation,
  validation_failed: APP_ERROR_MESSAGES.validation,
  too_many_attempts: APP_ERROR_MESSAGES.tooManyRequests,
  rate_limited: APP_ERROR_MESSAGES.tooManyRequests,
  conflict: APP_ERROR_MESSAGES.conflict,
  already_exists: APP_ERROR_MESSAGES.conflict,
};

const FIELD_LABELS: Record<string, string> = {
  name: "الاسم",
  email: "البريد الإلكتروني",
  phone: "رقم الموبايل",
  phone_number: "رقم الموبايل",
  phoneNumber: "رقم الموبايل",
  password: "كلمة المرور",
  password_confirmation: "تأكيد كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  city: "المحافظة",
  city_id: "المحافظة",
  location: "المحافظة",
  title: "العنوان",
  description: "الوصف",
  details: "التفاصيل",
  purpose: "الهدف",
  category_id: "التصنيف",
  categoryId: "التصنيف",
  categories: "التوجهات",
  rules: "القوانين",
  invited_users: "المستخدمون المدعوون",
  invitedUsers: "المستخدمون المدعوون",
  image: "الصورة",
  images: "الصور",
  amount: "المبلغ",
  reason: "السبب",
  body: "المحتوى",
  comment: "التعليق",
  contact_value: "بيانات التواصل",
  contactValue: "بيانات التواصل",
};

type ErrorLike = {
  message?: unknown;
  status?: unknown;
  code?: unknown;
};

function hasArabicText(value?: string | null): boolean {
  return Boolean(value && ARABIC_TEXT_PATTERN.test(value));
}

export function localizeApiValidationMessage(field: string, message: string): string {
  if (hasArabicText(message)) return message;

  const lower = message.toLowerCase();
  const label = FIELD_LABELS[field] ?? "هذا الحقل";

  if (field.toLowerCase().includes("phone")) {
    if (lower.includes("taken") || lower.includes("unique") || lower.includes("already")) {
      return "رقم الموبايل مستخدم مسبقاً.";
    }
    return FORM_ERROR_MESSAGES.phoneInvalid;
  }

  if (lower.includes("required")) return `${label} مطلوب.`;
  if (lower.includes("email")) return FORM_ERROR_MESSAGES.emailInvalid;
  if (lower.includes("taken") || lower.includes("unique") || lower.includes("already")) return `${label} مستخدم مسبقاً.`;
  if (lower.includes("confirm") || lower.includes("match")) return "التأكيد غير مطابق.";
  if (lower.includes("selected") && lower.includes("invalid")) return `القيمة المحددة في ${label} غير صالحة.`;
  if (lower.includes("format") || lower.includes("invalid")) return `صيغة ${label} غير صحيحة.`;
  if (lower.includes("at least") || lower.includes("minimum") || lower.includes("min")) return `${label} أقصر من الحد المسموح.`;
  if (lower.includes("maximum") || lower.includes("max") || lower.includes("greater than")) return `${label} أطول من الحد المسموح.`;
  if (lower.includes("file") && lower.includes("size")) return `حجم ${label} أكبر من الحد المسموح.`;

  return `يرجى التحقق من ${label}.`;
}

export function localizeApiErrorMessage(
  message: string | null | undefined,
  status: number | null,
  code: string | null,
  fallback = APP_ERROR_MESSAGES.generic,
): string {
  if (hasArabicText(message)) return message as string;
  if (code && ERROR_CODE_MESSAGES[code]) return ERROR_CODE_MESSAGES[code];

  const lower = message?.toLowerCase() ?? "";
  if (lower.includes("network request failed") || lower.includes("network error") || lower.includes("connection") || lower.includes("timeout")) return APP_ERROR_MESSAGES.network;
  if (lower.includes("credential") || lower.includes("password is incorrect")) return APP_ERROR_MESSAGES.auth.invalidCredentials;
  if (lower.includes("verification code") && lower.includes("expired")) return APP_ERROR_MESSAGES.auth.verificationCodeExpired;
  if (lower.includes("verification code")) return APP_ERROR_MESSAGES.auth.invalidVerificationCode;
  if (lower.includes("already verified")) return APP_ERROR_MESSAGES.auth.accountAlreadyVerified;
  if (lower.includes("not found")) return APP_ERROR_MESSAGES.notFound;
  if (lower.includes("forbidden") || lower.includes("permission") || lower.includes("unauthorized")) return APP_ERROR_MESSAGES.forbidden;
  if (lower.includes("too many") || lower.includes("rate limit")) return APP_ERROR_MESSAGES.tooManyRequests;
  if (lower.includes("validation") || lower.includes("invalid input")) return APP_ERROR_MESSAGES.validation;
  if (lower.includes("already exists") || lower.includes("duplicate") || lower.includes("conflict")) return APP_ERROR_MESSAGES.conflict;

  if (status === 401) return APP_ERROR_MESSAGES.unauthorized;
  if (status === 403) return APP_ERROR_MESSAGES.forbidden;
  if (status === 404) return APP_ERROR_MESSAGES.notFound;
  if (status === 409) return APP_ERROR_MESSAGES.conflict;
  if (status === 422) return APP_ERROR_MESSAGES.validation;
  if (status === 429) return APP_ERROR_MESSAGES.tooManyRequests;
  if (status !== null && status >= 500) return APP_ERROR_MESSAGES.server;

  return fallback;
}

export function getArabicErrorMessage(
  error: unknown,
  fallback = APP_ERROR_MESSAGES.generic,
): string {
  if (typeof error === "string") {
    return localizeApiErrorMessage(error, null, null, fallback);
  }

  if (!error || typeof error !== "object") return fallback;

  const candidate = error as ErrorLike;
  const message = typeof candidate.message === "string" ? candidate.message : null;
  const status = typeof candidate.status === "number" ? candidate.status : null;
  const code = typeof candidate.code === "string" ? candidate.code : null;

  return localizeApiErrorMessage(message, status, code, fallback);
}
