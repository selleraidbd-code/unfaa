import { ResponseObject } from "@/types";

import { CreateOrderPayload, OrderResponse } from "@/types/order-type";
import { CustomFetch } from "@/lib/CustomFetch";

const makeOrder = async (order: CreateOrderPayload) => {
    const response = await CustomFetch<ResponseObject<OrderResponse>>(
        "/order",
        {
            method: "POST",
            body: JSON.stringify(order),
        }
    );
    return response;
};

const getOrderById = async (orderId: string) => {
    const response = await CustomFetch<ResponseObject<OrderResponse>>(
        `/order/${orderId}`,
        {
            method: "GET",
        }
    );
    return response;
};

export { makeOrder, getOrderById };
