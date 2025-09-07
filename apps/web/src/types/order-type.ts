export enum OrderStatus {
    PLACED = "placed",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    INCOMPLETE = "incomplete",
    SEND = "send",
    HOLD = "hold",
    WAITING = "waiting",
    RECEIVED = "received",
    PROCESSING = "processing",
    NZC = "nzc",
    RETURN = "return",
}

export type CreateOrderPayload = {
    shopId: string;
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    deliveryZoneId: string;
    orderStatus: OrderStatus;
    orderItems: {
        productId: string;
        quantity: number;
        orderItemVariant?: {
            productVariantId: string;
            productVariantOptionId: string;
        }[];
    }[];
};
