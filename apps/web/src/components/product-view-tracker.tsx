"use client";

import { useEffect, useState } from "react";

import { config } from "@/config";

import { ViewContentEventsData } from "@/types/tracking-type";

interface ProductViewTrackerProps {
    productId: string;
    productName: string;
    productSlug: string;
    price: number;
    discountPrice: number;
    category?: string;
    shopSlug: string;
}

// Helper function to get cookie value by name
function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
    return undefined;
}

// Helper function to get user data from localStorage
function getUserData() {
    if (typeof window === "undefined") return null;

    try {
        const savedForm = localStorage.getItem("checkout_form");
        if (savedForm) {
            const parsedForm = JSON.parse(savedForm);
            const nameParts = (parsedForm.name || "").trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            return {
                phone: parsedForm.phone,
                first_name: firstName,
                last_name: lastName,
            };
        }
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
    }

    return null;
}

// Helper function to track ViewContent to backend API
async function trackViewContentToBackend(
    data: Omit<ViewContentEventsData, "user_data"> & { user_data: ViewContentEventsData["user_data"] },
    shopSlug: string
) {
    if (!config.serverUrl) {
        console.warn("⚠️ Server URL not configured");
        return;
    }

    try {
        const url = `${config.serverUrl}/extranal-tracking/view-content/${shopSlug}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Backend tracking failed: ${response.status} ${response.statusText}`);
        }

        console.log("✅ Backend ViewContent tracked:", {
            event_id: data.event_id,
            content_name: data.content_name,
        });
    } catch (error) {
        console.error("❌ Error tracking ViewContent to backend:", error);
    }
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
            if (typeof window !== "undefined" && window.fbq) {
                window.fbq("track", "ViewContent", {
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

                console.log("✅ Facebook ViewContent tracked:", {
                    viewId,
                    productId,
                    productName,
                    price: discountPrice,
                });
            }

            // Track TikTok Pixel ViewContent event
            if (typeof window !== "undefined" && window.ttq) {
                window.ttq.track("ViewContent", {
                    content_id: productId,
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

                console.log("✅ TikTok ViewContent tracked:", {
                    viewId,
                    productId,
                });
            }
        };

        const trackBackend = async () => {
            if (backendTracked) return;
            backendTracked = true;

            // Track to backend API
            const userData = getUserData();
            const fbc = getCookie("_fbc");
            const fbp = getCookie("_fbp");

            const backendData: ViewContentEventsData = {
                event_id: viewId,
                content_name: productName,
                content_category: category || "Uncategorized",
                content_ids: [productId],
                content_type: "product",
                value: discountPrice,
                currency: "BDT",
                user_data: {
                    phone: userData?.phone,
                    first_name: userData?.first_name,
                    last_name: userData?.last_name,
                    client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
                    fbc: fbc,
                    fbp: fbp,
                },
            };

            await trackViewContentToBackend(backendData, shopSlug);
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

    return null;
}
