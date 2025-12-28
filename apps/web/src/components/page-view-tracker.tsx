"use client";

import { useEffect } from "react";

interface PageViewTrackerProps {
    pageName?: string;
    pageData?: Record<string, unknown>;
}

export function PageViewTracker({ pageName, pageData }: PageViewTrackerProps) {
    useEffect(() => {
        // Track Facebook Pixel PageView
        if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "PageView");
        }

        // Track TikTok Pixel ViewContent
        if (typeof window !== "undefined" && (window as any).ttq) {
            (window as any).ttq.track("ViewContent", pageData);
        }

        // Optional: Log for debugging
        if (process.env.NODE_ENV === "development") {
            console.log("Page view tracked:", { pageName, pageData });
        }
    }, [pageName, pageData]);

    return null;
}
