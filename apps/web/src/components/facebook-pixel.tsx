"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

interface FacebookPixelProps {
    pixelId: string;
}

export function FacebookPixel({ pixelId }: FacebookPixelProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Only track PageView on route changes, not on initial load
        // The initial PageView is already tracked in the script initialization
        if (typeof window !== "undefined" && window.fbq && window.fbPixelInitialized) {
            window.fbq("track", "PageView");
        }
    }, [pathname, searchParams]);

    return (
        <>
            <Script
                id={`facebook-pixel-${pixelId}`}
                strategy="afterInteractive"
                onLoad={() => {
                    // Mark pixel as initialized to prevent duplicate tracking
                    if (typeof window !== "undefined") {
                        window.fbPixelInitialized = true;
                    }
                }}
                dangerouslySetInnerHTML={{
                    __html: `
                        (function(f,b,e,v,n,t,s) {
                            // Check if fbq is already initialized for this pixel
                            if(f.fbq && f.fbPixelId === '${pixelId}') return;

                            n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s);

                            // Store the current pixel ID to prevent re-initialization
                            f.fbPixelId = '${pixelId}';
                        })(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');

                        fbq('init', '${pixelId}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}

// Extend the Window interface to include fbq
declare global {
    interface Window {
        fbq: (
            action: string,
            event: string,
            data?: {
                content_ids?: string[];
                content_type?: string;
                content_name?: string;
                content_category?: string;
                value?: number;
                currency?: string;
                [key: string]: unknown;
            }
        ) => void;
        fbPixelId?: string;
        fbPixelInitialized?: boolean;
        _fbq?: unknown;
    }
}
