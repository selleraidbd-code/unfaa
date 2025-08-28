import config from "@/config";
import { ResponseObject } from "@/types";
import { Shop } from "@/types/shop-type";

export const getShops = async (): Promise<ResponseObject<Shop[]> | null> => {
    try {
        const response = await fetch(`${config.serverUrl}/shop?limit=1000`);

        if (!response.ok) {
            throw new Error("Failed to fetch shops");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching shops:", error);
        return null;
    }
};

export const getShopDetails = async (
    slug: string
): Promise<ResponseObject<Shop> | null> => {
    const shopSlug = slug.split(".")[0];
    console.log("shopSlug", shopSlug);

    try {
        const response = await fetch(
            `${config.serverUrl}/shop/details/${shopSlug}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch shop layout details");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching shop layout details:", error);
        return null;
    }
};
