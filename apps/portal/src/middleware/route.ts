export const ROUTES = {
    sellerRoutes: [
        "/brands",
        "/categories",
        "/customers",
        "/employees",
        "/landing-page",
        "/make-order",
        "/manage-shop",
        "/orders",
        "/payments",
        "/products",
        "/subscriptions",
        "/courses",
        "/delivery-orders",
        "/ai-order",
        "/make-order",
        "/tickets",
    ] as const,
    superAdminRoutes: [
        "/overview",
        "/shops",
        "/users",
        "/sellers",
        "/components",
        "/manage-courses",
        "/manage-ticket",
        "/manage-subscriptions",
        "/shop-subscriptions",
        "/templates",
    ] as const,
    adminRoutes: [
        "/overview",
        "/sellers",
        "/components",
        "/manage-courses",
        "/manage-ticket",
        "/templates",
        "/shop-subscriptions",
    ] as const,
    public: ["/onboarding"] as const,
    auth: ["/auth/sign-in", "/auth/sign-up"] as const,
    authNotVerified: ["/auth/verify-email"] as const,
};

export const isRouteMatched = (pathname: string, routes: readonly string[]) =>
    routes.some((route) => pathname.startsWith(route));

export const isRouteExactMatched = (pathname: string, routes: readonly string[]) =>
    routes.some((route) => pathname === route);
