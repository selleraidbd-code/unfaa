import { NextRequest, NextResponse } from "next/server";

const PRIMARY_DOMAIN = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || "unfaa";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const host = req.headers.get("host");

    // Skip middleware for static files
    if (pathname.match(/\.(mp3|mp4|wav|ogg|pdf|jpg|jpeg|png|gif|svg|webp|ico)$/)) {
        return NextResponse.next();
    }

    if (!host || host.trim() === "") return NextResponse.next(); // TODO: Navigate to 404 page

    // Extract domain from host
    const domain = host.split(":")[0];

    // console.log("domain", domain);

    if (!domain || domain.trim() === "") return NextResponse.next();

    const isPrimary = domain.includes(PRIMARY_DOMAIN);
    console.log("isPrimary", isPrimary,{domain,PRIMARY_DOMAIN});

    // Primary domain (oneielts.com)
    if (isPrimary) {
        return NextResponse.next();
    }

    // Tenant domain - rewrite /shop/domain to /domain
    // If NOT primary domain, always redirect to `/shop/{domain}`
    if (!isPrimary && !domain.includes("localhost")) {
        const shopPath = `/shop/${domain}`;
        // If we are not already on `/shop/{domain}`, redirect there
        if (!pathname.startsWith(shopPath)) {
            const redirectUrl = new URL(shopPath, req.url);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

// Matcher configuration - exclude static files and API routes
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
