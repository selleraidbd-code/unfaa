import { cache } from "react";

import { config } from "@/config";
import { ResponseObject } from "@/types";

import { Shop } from "@/types/shop-type";

// Cache duration: 1 hour (3600 seconds)
const REVALIDATE_TIME = 300;

export const getShops = cache(async (): Promise<ResponseObject<Shop[]> | null> => {
    try {
        const response = await fetch(`${config.serverUrl}/shop?limit=1000`, {
            next: {
                revalidate: REVALIDATE_TIME,
                tags: ["shops"],
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch shops");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching shops:", error);
        return null;
    }
});

// Cached shop details function to prevent duplicate API calls
// This ensures that multiple calls with the same slug within a single request
// will only result in one actual API call
export const getShopDetails = cache(async (slug: string): Promise<ResponseObject<Shop> | null> => {
    const shopSlug = slug.split(".")[0];

    try {
        const response = await fetch(`${config.serverUrl}/shop/details/${shopSlug}`, {
            next: {
                revalidate: REVALIDATE_TIME, // Revalidate every 1 hour
                tags: [`shop-${shopSlug}`], // Tag for on-demand revalidation
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch shop layout details");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching shop layout details:", error);
        return null;
    }
});
