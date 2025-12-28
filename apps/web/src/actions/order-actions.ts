import { config } from "@/config";
import { ResponseObject } from "@/types";

import { CreateOrderPayload, OrderResponse } from "@/types/order-type";
import { CustomFetch } from "@/lib/CustomFetch";

const makeOrder = async (order: CreateOrderPayload) => {
    const response = await CustomFetch<ResponseObject<OrderResponse>>("/order", {
        method: "POST",
        body: JSON.stringify(order),
    });
    return response;
};

const getOrderById = async (orderId: string) => {
    const response = await CustomFetch<ResponseObject<OrderResponse>>(`/order/${orderId}`, {
        method: "GET",
    });
    return response;
};

const getOrderBySerialNumber = async (orderSerialNumber: string) => {
    const url = `${config.serverUrl}/order/order-serial-number/${orderSerialNumber}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data as ResponseObject<OrderResponse>;
};

export { makeOrder, getOrderById, getOrderBySerialNumber };
