import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const isRouteMatched = (pathname: string, routes: readonly string[]) =>
    routes.some((route) => pathname.startsWith(route));

export const ROUTES = {
    protected: [
        "/brands",
        "/categories",
        "/components",
        "/customers",
        "/employees",
        "/landing-page",
        "/make-order",
        "/manage-shop",
        "/orders",
        "/payments",
        "/products",
        "/shops",
        "/subscriptions",
        "/templates",
        "/tutorial",
        "/upload-tutorial",
        "/users",
    ] as const,
    public: ["/onboarding"] as const,
    auth: ["/auth/sign-in", "/auth/sign-up"] as const,
};

export async function middleware(req: NextRequest) {
    const { pathname, searchParams, search } = req.nextUrl;

    const isAuthenticated = await checkAuth();
    const isProtectedRoute = isRouteMatched(pathname, ROUTES.protected);
    const isAuthRoute = isRouteMatched(pathname, ROUTES.auth);
    const isPublicRoute = isRouteMatched(pathname, ROUTES.public);
    const isRootRoute = pathname === "/";

    if (isPublicRoute) return NextResponse.next();

    if (isAuthenticated) {
        if (isAuthRoute) {
            const callback = searchParams.get("callbackUrl") || "/";
            return redirectTo(callback, req);
        }
        return NextResponse.next();
    }

    if (isProtectedRoute || isRootRoute) {
        const callback = encodeURIComponent(pathname + search);
        return redirectTo(`/auth/sign-in?callbackUrl=${callback}`, req);
    }

    return NextResponse.next();
}

function redirectTo(path: string, req: NextRequest): NextResponse {
    const url = new URL(path, req.url);

    return url.pathname === req.nextUrl.pathname
        ? NextResponse.next()
        : NextResponse.redirect(url);
}

const checkAuth = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken && refreshToken) {
        return true;
    }

    return false;
};

// Matcher configuration - exclude static files and API routes
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
