import {
  AppRoute,
  ROUTES,
  ROUTE_OBJECTS,
  RouteCategory,
  RouteObject,
} from "@/constants/routers";
import { useRouter } from "expo-router";

export class NavigationHelper {
  static navigate(
    router: ReturnType<typeof useRouter>,
    route: AppRoute,
    options?: { replace?: boolean; params?: Record<string, any> }
  ) {
    const navigationOptions = options?.params
      ? { pathname: route as string, params: options.params }
      : (route as any);

    if (options?.replace) {
      router.replace(navigationOptions);
    } else {
      router.push(navigationOptions);
    }
  }

  static goBack(router: ReturnType<typeof useRouter>) {
    router.back();
  }

  static goToHome(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.TABS.HOME);
  }

  static goToPosts(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.TABS.POSTS);
  }

  static goToCreatePost(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.ROOT.CREATE_POST);
  }

  static goToMyReports(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.ROOT.MY_REPORTS);
  }

  static goToReportCreate(
    router: ReturnType<typeof useRouter>,
    params?: { entityType?: string; entityId?: string },
  ) {
    this.navigate(
      router,
      ROUTES.ROOT.REPORT_CREATE,
      params ? { params } : undefined,
    );
  }

  static goToDonations(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.TABS.DONATIONS);
  }

  static goToOpportunities(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.TABS.OPPORTUNITIES);
  }

  static goToAccount(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.TABS.ACCOUNT);
  }

  static goToSignIn(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.AUTH.SIGN_IN);
  }

  static goToSignUp(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.AUTH.SIGN_UP);
  }

  static goToResetPassword(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.AUTH.RESET_PASSWORD);
  }

  static goToVerifyCode(
    router: ReturnType<typeof useRouter>,
    params?: { phoneNumber: string; flow?: "register" | "reset" }
  ) {
    this.navigate(
      router,
      ROUTES.AUTH.VERIFY_CODE,
      params ? { params } : undefined
    );
  }

  static goToProfile(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.PROFILE);
  }

  static goToMyPosts(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.MY_POSTS);
  }

  static goToSavedPosts(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.SAVED_POSTS);
  }

  static goToNotifications(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.NOTIFICATIONS);
  }

  static goToNotificationPreferences(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.NOTIFICATION_PREFERENCES);
  }

  static goToLanguage(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.LANGUAGE);
  }

  static goToSupport(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.SUPPORT);
  }

  static goToPrivacy(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.PRIVACY);
  }

  static goToAbout(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.ABOUT);
  }

  static goToChangePassword(router: ReturnType<typeof useRouter>) {
    this.navigate(router, ROUTES.SETTINGS.CHANGE_PASSWORD);
  }

  static getRouteByPath(path: string): RouteObject | undefined {
    return ROUTE_OBJECTS.find((route: RouteObject) => route.path === path);
  }

  static getRoutesByCategory(category: RouteCategory): RouteObject[] {
    return ROUTE_OBJECTS.filter(
      (route: RouteObject) => route.category === category
    );
  }

  static getAuthRoutes(): RouteObject[] {
    return this.getRoutesByCategory("auth");
  }

  static getRootRoutes(): RouteObject[] {
    return this.getRoutesByCategory("root");
  }

  static getTabRoutes(): RouteObject[] {
    return this.getRoutesByCategory("tabs");
  }

  static requiresAuth(route: AppRoute): boolean {
    const routeObject = this.getRouteByPath(route);
    return routeObject?.requiresAuth ?? false;
  }

  static getCurrentRoute(): string | null {
    return null;
  }
}

export const {
  getRouteByPath,
  getRoutesByCategory,
  getAuthRoutes,
  getRootRoutes,
  getTabRoutes,
  requiresAuth,
  getCurrentRoute,
} = NavigationHelper;
