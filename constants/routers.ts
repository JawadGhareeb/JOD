export const ROUTES = {
  AUTH: {
    SIGN_IN: "/(auth)/sign-in",
    SIGN_UP: "/(auth)/sign-up",
    RESET_PASSWORD: "/(auth)/reset-password",
    VERIFY_CODE: "/(auth)/verify-code",
  },

  ROOT: {
    HOME: "/(root)/(tabs)/home",
    POSTS: "/(root)/(tabs)/posts",
    CREATE_POST: "/(root)/posts/create",
  },

  SETTINGS: {
    PROFILE: "/(root)/settings/profile",
    MY_POSTS: "/(root)/settings/my-posts",
    SAVED_POSTS: "/(root)/settings/saved-posts",
    NOTIFICATIONS: "/(root)/settings/notifications",
    LANGUAGE: "/(root)/settings/language",
    SUPPORT: "/(root)/settings/support",
    PRIVACY: "/(root)/settings/privacy",
    ABOUT: "/(root)/settings/about",
    CHANGE_PASSWORD: "/(root)/settings/change-password",
  },

  TABS: {
    HOME: "/(root)/(tabs)/home",
    POSTS: "/(root)/(tabs)/posts",
    DONATIONS: "/(root)/(tabs)/donations",
    OPPORTUNITIES: "/(root)/(tabs)/opportunities",
    ACCOUNT: "/(root)/(tabs)/account",
  },
} as const;

export type AuthRoute = (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH];
export type RootRoute = (typeof ROUTES.ROOT)[keyof typeof ROUTES.ROOT];
export type SettingsRoute =
  (typeof ROUTES.SETTINGS)[keyof typeof ROUTES.SETTINGS];
export type TabRoute = (typeof ROUTES.TABS)[keyof typeof ROUTES.TABS];
export type AppRoute = AuthRoute | RootRoute | SettingsRoute | TabRoute;

export type RouteCategory = "auth" | "root" | "tabs" | "settings";

export interface RouteObject {
  path: string;
  category: RouteCategory;
  title: string;
  requiresAuth?: boolean;
}

export const ROUTE_OBJECTS: RouteObject[] = [
  //auth pages
  {
    path: ROUTES.AUTH.SIGN_IN,
    category: "auth",
    title: "تسجيل الدخول",
    requiresAuth: false,
  },
  {
    path: ROUTES.AUTH.SIGN_UP,
    category: "auth",
    title: "إنشاء حساب جديد",
    requiresAuth: false,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    category: "auth",
    title: "إعادة تعيين كلمة المرور",
    requiresAuth: false,
  },
  {
    path: ROUTES.AUTH.VERIFY_CODE,
    category: "auth",
    title: "تأكيد الرمز",
    requiresAuth: false,
  },

  //root pages
  {
    path: ROUTES.ROOT.HOME,
    category: "root",
    title: "الرئيسية",
    requiresAuth: true,
  },
  {
    path: ROUTES.ROOT.POSTS,
    category: "root",
    title: "Posts",
    requiresAuth: true,
  },
  {
    path: ROUTES.ROOT.CREATE_POST,
    category: "root",
    title: "Create Post",
    requiresAuth: true,
  },
  //tabs pages
  {
    path: ROUTES.TABS.HOME,
    category: "tabs",
    title: "الرئيسية",
    requiresAuth: true,
  },
  {
    path: ROUTES.TABS.POSTS,
    category: "tabs",
    title: "Posts",
    requiresAuth: true,
  },
  {
    path: ROUTES.TABS.DONATIONS,
    category: "tabs",
    title: "التبرعات",
    requiresAuth: true,
  },
  {
    path: ROUTES.TABS.OPPORTUNITIES,
    category: "tabs",
    title: "الفرص",
    requiresAuth: true,
  },
  {
    path: ROUTES.TABS.ACCOUNT,
    category: "tabs",
    title: "حسابي",
    requiresAuth: true,
  },

  // Settings pages
  {
    path: ROUTES.SETTINGS.PROFILE,
    category: "settings",
    title: "الملف الشخصي",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.MY_POSTS,
    category: "settings",
    title: "My Posts",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.SAVED_POSTS,
    category: "settings",
    title: "Saved Posts",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.NOTIFICATIONS,
    category: "settings",
    title: "الإشعارات",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.LANGUAGE,
    category: "settings",
    title: "اللغة",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.SUPPORT,
    category: "settings",
    title: "الدعم الفني",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.PRIVACY,
    category: "settings",
    title: "سياسة الخصوصية",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.ABOUT,
    category: "settings",
    title: "حول التطبيق",
    requiresAuth: true,
  },
  {
    path: ROUTES.SETTINGS.CHANGE_PASSWORD,
    category: "settings",
    title: "تغيير كلمة المرور",
    requiresAuth: true,
  },
];

