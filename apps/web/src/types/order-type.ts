import { Product, ProductVariant } from "@/types/product-type";

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
        orderItemVariant: {
            productVariantId: string;
            productVariantOptionId: string;
        }[];
    }[];
};

export type OrderResponse = {
    id: string;
    shopId: string;
    orderItems: {
        id: string;
        productId: string;
        productVariant?: ProductVariant;
        quantity: number;
        product: Product;
    }[];
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    orderNumber?: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentId: string;
    updatedAt: string;
};
