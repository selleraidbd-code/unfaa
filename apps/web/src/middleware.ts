import { NextRequest, NextResponse } from "next/server";

const PRIMARY_DOMAIN = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || "unfaa.com";

export async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const host = req.headers.get("host");

    // Skip middleware for static files
    if (
        pathname.match(/\.(mp3|mp4|wav|ogg|pdf|jpg|jpeg|png|gif|svg|webp|ico)$/)
    ) {
        return NextResponse.next();
    }

    if (!host || host.trim() === "") return NextResponse.next(); // TODO: Navigate to 404 page

    // Extract domain from host
    const domain = host.split(":")[0];

    // console.log("domain", domain);

    if (!domain || domain.trim() === "") return NextResponse.next();

    const isPrimary =
        domain === PRIMARY_DOMAIN ||
        domain === "localhost" ||
        domain.includes(".vercel.app") ||
        /^\d+\.\d+\.\d+\.\d+$/.test(domain);

    // console.log("domain", domain);
    // console.log("isPrimary", isPrimary);

    // Primary domain (oneielts.com)
    if (isPrimary) {
        return NextResponse.next();
    }

    console.log("domain", domain);

    // Tenant domain
    const orgPath = `/shop/${domain}`;
    let rewriteUrl: URL | null = null;

    // Setup rewrite if needed
    if (!pathname.startsWith(orgPath)) {
        rewriteUrl = new URL(`${orgPath}${pathname}`, req.url);
        rewriteUrl.search = search;
    }

    return rewriteUrl ? NextResponse.rewrite(rewriteUrl) : NextResponse.next();
}

// Matcher configuration - exclude static files and API routes
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
