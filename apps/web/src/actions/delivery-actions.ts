import { CustomFetch } from "@/lib/CustomFetch";

const getDeliveryZones = async (shopId: string) => {
    const response = await CustomFetch("/delivery", {
        method: "GET",
        body: JSON.stringify({ shopId }),
    });

    console.log("delivery response", response);
    return response;
};

export { getDeliveryZones };
