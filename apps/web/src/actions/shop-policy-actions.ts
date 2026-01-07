import { config } from "@/config";
import { ResponseObject } from "@/types";

import { ShopExtraInfo, ShopPolicyType } from "@/types/shop-type";

export const getShopPolicy = async (
    slug: string,
    policyType: ShopPolicyType
): Promise<ResponseObject<ShopExtraInfo> | null> => {
    const shopSlug = slug.split(".")[0];

    try {
        const response = await fetch(`${config.serverUrl}/shop/extra-info/${shopSlug}/${policyType}`);

        if (!response.ok) {
            throw new Error("Failed to fetch shop layout details");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching shop layout details:", error);
        return null;
    }
};
