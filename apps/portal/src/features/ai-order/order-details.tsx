"use client";

import { useGetDeliveriesQuery } from "@/redux/api/delivery-api";
import { useAppSelector } from "@/redux/store/hook";
import { OrderDetailsType } from "@/types/order-type";
import { CustomSearchSelect } from "@workspace/ui/components/custom/custom-search-select";

interface OrderDetailsProps {
    orderDetails: OrderDetailsType;
    setOrderDetails: (orderDetails: OrderDetailsType) => void;
}

export const OrderDetails = ({
    orderDetails,
    setOrderDetails,
}: OrderDetailsProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id || "";
    const { data: delivery } = useGetDeliveriesQuery({ shopId });

    const deliveryOptions = delivery?.data.map((delivery) => ({
        label: delivery.name,
        value: delivery.deliveryZones[0]?.id || "",
    }));

    return (
        <div>
            <CustomSearchSelect
                label="Delivery"
                options={deliveryOptions || []}
                placeholder="Select Delivery"
                value={orderDetails?.deliveryZoneId || ""}
                onChange={(value) =>
                    setOrderDetails({ ...orderDetails, deliveryZoneId: value })
                }
            />
        </div>
    );
};
