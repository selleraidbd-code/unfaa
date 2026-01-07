import { CustomFetch } from "@/lib/CustomFetch";

const getDeliveryZones = async (shopId: string) => {
    const response = await CustomFetch("/delivery", {
        method: "GET",
        body: JSON.stringify({ shopId }),
    });

    return response;
};

export { getDeliveryZones };
