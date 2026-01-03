"use client";

import { useEffect, useRef, useState } from "react";

import { buildUserData, trackEventToBackend, trackFacebookPixel, trackTikTokPixel } from "@/lib/tracking-events";

interface ProductViewTrackerProps {
    productId: string;
    productName: string;
    productSlug: string;
    price: number;
    discountPrice: number;
    category?: string;
    shopSlug: string;
}

export function ProductViewTracker({
    productId,
    productName,
    productSlug,
    price,
    discountPrice,
    category,
    shopSlug,
}: ProductViewTrackerProps) {
    const [tracked, setTracked] = useState(false);
    const scrollMilestonesRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        // Prevent duplicate tracking
        if (tracked) return;

        // Generate a unique view ID
        const viewId = `${productId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        let backendTracked = false;
        let pixelsTracked = false;

        const trackPixels = () => {
            if (pixelsTracked) return;
            pixelsTracked = true;

            // Track Facebook Pixel ViewContent event
            trackFacebookPixel("ViewContent", {
                content_ids: [productId],
                content_type: "product",
                content_name: productName,
                content_category: category || "Uncategorized",
                value: discountPrice,
                currency: "BDT",
                // Custom parameters
                product_slug: productSlug,
                shop_slug: shopSlug,
                view_id: viewId,
                original_price: price,
                discount_price: discountPrice,
            });

            // Track TikTok Pixel ViewContent event
            trackTikTokPixel("ViewContent", {
                content_id: productId,
                content_ids: [productId],
                content_type: "product",
                content_name: productName,
                content_category: category || "Uncategorized",
                value: discountPrice,
                price: discountPrice,
                currency: "BDT",
                // Custom parameters
                product_slug: productSlug,
                shop_slug: shopSlug,
                view_id: viewId,
                original_price: price,
            });
        };

        const trackBackend = async () => {
            if (backendTracked) return;
            backendTracked = true;

            // Track to backend API with all required fields
            await trackEventToBackend(
                "ViewContent",
                {
                    event_id: viewId,
                    content_name: productName,
                    content_category: category || "Uncategorized",
                    content_ids: [productId],
                    content_type: "product",
                    value: discountPrice,
                    currency: "BDT",
                    user_data: buildUserData(), // Includes all available user data
                },
                shopSlug
            );
        };

        // Always track backend immediately (don't wait for pixels)
        trackBackend();
        sessionStorage.setItem(`product_view_${productId}`, viewId);

        // Check if pixels are ready
        const arePixelsReady = () => {
            if (typeof window === "undefined") return false;
            const fbqReady = window.fbq && typeof window.fbq === "function";
            const ttqReady = window.ttq && typeof window.ttq === "object";
            return fbqReady || ttqReady;
        };

        // Try to track pixels immediately if ready
        if (arePixelsReady()) {
            trackPixels();
            setTracked(true);
            return;
        }

        // If pixels not ready, retry with increasing delays
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelays = [100, 300, 500, 1000, 2000];

        const tryTrackPixels = () => {
            if (pixelsTracked || retryCount >= maxRetries) {
                setTracked(true);
                return;
            }

            if (arePixelsReady()) {
                trackPixels();
                setTracked(true);
            } else {
                retryCount++;
                const delay = retryDelays[retryCount - 1] || 2000;
                setTimeout(tryTrackPixels, delay);
            }
        };

        // Start retrying after initial delay
        const initialTimer = setTimeout(tryTrackPixels, retryDelays[0]);

        // Set tracked after a maximum timeout to ensure cleanup
        const maxTimeout = setTimeout(() => {
            setTracked(true);
        }, 5000);

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(maxTimeout);
        };
    }, [productId, productName, productSlug, price, discountPrice, category, shopSlug, tracked]);

    // Scroll tracking effect
    useEffect(() => {
        if (typeof window === "undefined") return;

        let scrollTimeout: NodeJS.Timeout;
        const scrollMilestonesToTrack = [25, 50, 75, 100];

        const handleScroll = () => {
            // Throttle scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                const scrollBottom = scrollTop + windowHeight;
                const scrollPercentage = Math.round((scrollBottom / documentHeight) * 100);

                // Check which milestones have been reached
                scrollMilestonesToTrack.forEach((milestone) => {
                    if (scrollPercentage >= milestone && !scrollMilestonesRef.current.has(milestone)) {
                        // Mark this milestone as tracked
                        scrollMilestonesRef.current.add(milestone);

                        // Track scroll event
                        const scrollEventId = `scroll_${productId}_${milestone}%_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

                        // Track to backend as Lead event (scroll depth indicates engagement)
                        trackEventToBackend(
                            "Lead",
                            {
                                event_id: scrollEventId,
                                content_name: `${productName} - ${milestone}% Scroll`,
                                content_category: category || "Uncategorized",
                                content_ids: [productId],
                                content_type: "product",
                                value: discountPrice,
                                currency: "BDT",
                                user_data: buildUserData(),
                            },
                            shopSlug
                        );

                        // Track Facebook Pixel (custom event for scroll depth)
                        trackFacebookPixel("Lead", {
                            content_ids: [productId],
                            content_type: "product",
                            content_name: productName,
                            content_category: category || "Uncategorized",
                            value: discountPrice,
                            currency: "BDT",
                            scroll_depth: milestone,
                        });

                        // Track TikTok Pixel
                        trackTikTokPixel("CompleteRegistration", {
                            content_id: productId,
                            content_ids: [productId],
                            content_type: "product",
                            content_name: productName,
                            content_category: category || "Uncategorized",
                            value: discountPrice,
                            currency: "BDT",
                            scroll_depth: milestone,
                        });

                        console.log(`✅ Scroll ${milestone}% tracked for product: ${productName}`);
                    }
                });
            }, 100); // Throttle to 100ms
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        // Check initial scroll position
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [productId, productName, productSlug, price, discountPrice, category, shopSlug]);

    return null;
}
