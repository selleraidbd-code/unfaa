"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

interface TikTokPixelProps {
    pixelId: string;
}

export function TikTokPixel({ pixelId }: TikTokPixelProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Only track on route changes, not on initial load
        // The initial page view is already tracked in the script initialization
        if (typeof window !== "undefined" && window.ttq && window.ttqPixelInitialized) {
            window.ttq.page();
        }
    }, [pathname, searchParams]);

    return (
        <>
            <Script
                id={`tiktok-pixel-${pixelId}`}
                strategy="afterInteractive"
                onLoad={() => {
                    // Mark pixel as initialized to prevent duplicate tracking
                    if (typeof window !== "undefined") {
                        window.ttqPixelInitialized = true;
                    }
                }}
                dangerouslySetInnerHTML={{
                    __html: `
                        (function (w, d, t) {
                            // Check if ttq is already initialized for this pixel
                            if(w.ttq && w.ttqPixelId === '${pixelId}') return;

                            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                            ttq.load('${pixelId}');
                            ttq.page();

                            // Store the current pixel ID to prevent re-initialization
                            w.ttqPixelId = '${pixelId}';
                        })(window, document, 'ttq');
                    `,
                }}
            />
        </>
    );
}

// Extend the Window interface to include ttq
declare global {
    interface Window {
        ttq: {
            track: (event: string, data?: Record<string, unknown>) => void;
            page: () => void;
            identify: (data: Record<string, unknown>) => void;
            _i?: Record<string, unknown>;
            _t?: Record<string, unknown>;
            _o?: Record<string, unknown>;
        };
        TiktokAnalyticsObject?: string;
        ttqPixelId?: string;
        ttqPixelInitialized?: boolean;
    }
}
