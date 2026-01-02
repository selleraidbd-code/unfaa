"use client";

import { Package, PackageProduct } from "@/types/landing-type";
import { Product, ProductVariantOption } from "@/types/product-type";
import { TrackingData } from "@/lib/tracking-utils";

export type TikTokContentItem = {
    content_id: string;
    content_name: string;
    content_type: string;
    price: number;
    quantity: number;
};

export type TikTokEventParams = {
    contents?: TikTokContentItem[];
    value?: number;
    currency?: string;
    order_id?: string;
    content_id?: string;
    content_name?: string;
    content_type?: string;
    content_category?: string;
    price?: number;
    [key: string]: unknown;
};

/**
 * Check if TikTok tracking is available (has tracking data and pixel loaded)
 */
export function isTikTokTrackingAvailable(trackingData: TrackingData | null): boolean {
    if (typeof window === "undefined") return false;
    const hasTikTokData = !!(trackingData?.ttclid || trackingData?.ttp);
    const hasTikTokPixel = !!window.ttq;
    return hasTikTokData && hasTikTokPixel;
}

/**
 * Track a TikTok Pixel event
 * @param eventName - TikTok event name (e.g., "CompletePayment", "AddToCart", "ViewContent")
 * @param params - Event parameters
 * @param trackingData - Optional tracking data to include ttclid and ttp
 * @returns true if event was tracked, false otherwise
 */
export function trackTikTokEvent(
    eventName: string,
    params: TikTokEventParams = {},
    trackingData?: TrackingData | null
): boolean {
    if (typeof window === "undefined" || !window.ttq) {
        return false;
    }

    // Check if TikTok tracking data is available (only required for certain events)
    if (trackingData && !isTikTokTrackingAvailable(trackingData)) {
        return false;
    }

    try {
        // Include tracking parameters if available
        const eventParams: TikTokEventParams = {
            ...params,
        };

        if (trackingData?.ttclid) {
            eventParams.ttclid = trackingData.ttclid;
        }
        if (trackingData?.ttp) {
            eventParams.ttp = trackingData.ttp;
        }

        window.ttq.track(eventName, eventParams);

        console.log(`✅ TikTok ${eventName} tracked:`, eventParams);
        return true;
    } catch (error) {
        console.error(`❌ Error tracking TikTok ${eventName} event:`, error);
        return false;
    }
}

/**
 * Build contents array for TikTok events from a single product
 */
export function buildTikTokProductContents(
    product: Product,
    selectedVariants?: Record<string, ProductVariantOption>,
    quantity: number = 1
): TikTokContentItem[] {
    // Calculate product price with variant extras
    let productPrice = product.discountPrice;
    if (selectedVariants) {
        Object.values(selectedVariants).forEach((option) => {
            productPrice += option.extraPrice;
        });
    }

    return [
        {
            content_id: product.id,
            content_name: product.name,
            content_type: "product",
            price: productPrice,
            quantity,
        },
    ];
}

/**
 * Build contents array for TikTok events from a package
 */
export function buildTikTokPackageContents(selectedPackage: Package, fallbackProduct?: Product): TikTokContentItem[] {
    return selectedPackage.packageProducts.map((packageProduct: PackageProduct) => {
        // Try to get product info from packageProduct, fallback to main product
        const productName =
            (packageProduct as PackageProduct & { product?: Product })?.product?.name ||
            fallbackProduct?.name ||
            "Product";
        const productPrice =
            (packageProduct as PackageProduct & { product?: Product })?.product?.discountPrice ||
            fallbackProduct?.discountPrice ||
            0;

        return {
            content_id: packageProduct.productId,
            content_name: productName,
            content_type: "product",
            price: productPrice,
            quantity: packageProduct.quantity,
        };
    });
}

/**
 * Hook for tracking TikTok Pixel events (wrapper for convenience)
 * @param trackingData - Tracking data from collectTrackingData
 * @returns Object with isTikTokAvailable flag and trackEvent function
 */
export function useTikTokTracking(trackingData: TrackingData | null) {
    const isTikTokAvailable = isTikTokTrackingAvailable(trackingData);

    const trackEvent = (eventName: string, params: TikTokEventParams = {}): boolean => {
        return trackTikTokEvent(eventName, params, trackingData);
    };

    return {
        isTikTokAvailable,
        trackEvent,
        buildProductContents: buildTikTokProductContents,
        buildPackageContents: buildTikTokPackageContents,
    };
}
