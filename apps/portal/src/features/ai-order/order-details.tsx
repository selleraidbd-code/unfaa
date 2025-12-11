"use client";

import { useEffect } from "react";

import { useGetDeliveriesQuery } from "@/redux/api/delivery-api";
import { useAppSelector } from "@/redux/store/hook";
import { CustomSearchSelect } from "@workspace/ui/components/custom/custom-search-select";

import { OrderDetailsType } from "@/types/order-type";

interface OrderDetailsProps {
    orderDetails: OrderDetailsType;
    setOrderDetails: (orderDetails: OrderDetailsType) => void;
}

export const OrderDetails = ({ orderDetails, setOrderDetails }: OrderDetailsProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id || "";
    const { data: delivery } = useGetDeliveriesQuery({ shopId });

    const deliveryOptions = delivery?.data.map((delivery) => ({
        label: delivery.name,
        value: delivery.deliveryZones[0]?.id || "",
    }));

    const firstOptionValue =
        deliveryOptions && deliveryOptions.length > 0 && deliveryOptions[0] ? deliveryOptions[0].value : "";
    const selectedValue = orderDetails?.deliveryZoneId || firstOptionValue;

    useEffect(() => {
        if (deliveryOptions && deliveryOptions.length > 0 && !orderDetails?.deliveryZoneId) {
            const firstOption = deliveryOptions[0];
            if (firstOption) {
                setOrderDetails({ ...orderDetails, deliveryZoneId: firstOption.value });
            }
        }
    }, [deliveryOptions, orderDetails, setOrderDetails]);

    return (
        <CustomSearchSelect
            label="Delivery"
            options={deliveryOptions || []}
            placeholder="Select Delivery"
            value={selectedValue}
            onChange={(value) => setOrderDetails({ ...orderDetails, deliveryZoneId: value })}
        />
    );
};
