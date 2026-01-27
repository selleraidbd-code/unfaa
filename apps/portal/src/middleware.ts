import { NextRequest, NextResponse } from "next/server";

import { User } from "@/features/auth/auth-type";
import { isRouteExactMatched, isRouteMatched, ROUTES } from "@/middleware/route";
import { UserRole } from "@/types";

export async function middleware(req: NextRequest) {
    const { pathname, searchParams, search } = req.nextUrl;

    const isAuthenticated = checkAuth(req);
    const isSellerRoute = isRouteMatched(pathname, ROUTES.sellerRoutes);
    const isSuperAdminRoute = isRouteMatched(pathname, ROUTES.superAdminRoutes);
    const isAuthRoute = isRouteExactMatched(pathname, ROUTES.auth);
    const isAuthNotVerifiedRoute = isRouteExactMatched(pathname, ROUTES.authNotVerified);
    const isPublicRoute = isRouteMatched(pathname, ROUTES.public);
    const isRootRoute = pathname === "/";

    if (isPublicRoute) return NextResponse.next();

    if (isAuthenticated) {
        const { isVerified, isAdmin, isSeller, isEmployee } = checkUserVerified(req);
        if (!isVerified && (isSellerRoute || isRootRoute || isAuthRoute || isSuperAdminRoute || isEmployee)) {
            return redirectTo("/auth/verify-email", req);
        }
        if (isVerified && !isAdmin && !isSeller && !isEmployee) {
            return redirectTo("/onboarding", req);
        }
        if (isVerified && isAuthNotVerifiedRoute) {
            return redirectTo("/", req);
        }
        if (isAuthRoute) {
            const callback = searchParams.get("callbackUrl") || "/";
            return redirectTo(callback, req);
        }
        if (isSuperAdminRoute && !isAdmin) {
            return redirectTo("/", req);
        }
        return NextResponse.next();
    }

    if (isSellerRoute || isRootRoute || isSuperAdminRoute) {
        const callback = encodeURIComponent(pathname + search);
        return redirectTo(`/auth/sign-in?callbackUrl=${callback}`, req);
    }

    return NextResponse.next();
}

function redirectTo(path: string, req: NextRequest): NextResponse {
    const url = new URL(path, req.url);

    return url.pathname === req.nextUrl.pathname ? NextResponse.next() : NextResponse.redirect(url);
}

const checkAuth = (req: NextRequest) => {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (accessToken && refreshToken) {
        return true;
    }

    return false;
};

const checkUserVerified = (req: NextRequest) => {
    const userCookie = req.cookies.get("user")?.value;
    const user = userCookie ? (JSON.parse(userCookie) as User) : ({} as User);

    const isVerified = user?.isVerified;
    const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
    const isSeller = user?.role === UserRole.SELLER && user?.shop;
    const isEmployee = user?.role === UserRole.EMPLOYEE;

    return {
        isVerified,
        isAdmin,
        isSeller,
        isEmployee,
    };
};

// Matcher configuration - exclude static files and API routes
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
