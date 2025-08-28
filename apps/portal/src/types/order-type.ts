export enum OrderStepIndicator {
    CUSTOMER = "customer",
    PRODUCTS = "products",
    DETAILS = "details",
}

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

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}

export type Order = {
    id: string;
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    shopId: string;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    orderNumber: number;
    createdAt: string;
    updatedAt: string;
    orderItems: {
        id: string;
        orderId: string;
        quantity: number;
        productId: string;
        productVariantId: string;
        createdAt: string;
        updatedAt: string;
        product: {
            id: string;
            name: string;
            banglaName: string;
            description: string;
            price: number | null;
            discountPrice: number | null;
            photoURL: string;
            activeStatus: string;
            keywords: string;
            stock: number;
            createdAt: string;
            updatedAt: string;
            shopId: string;
            categoryId: string;
        };
        productVariant: {
            id: string;
            name: string;
            price: number;
            discountPrice: number;
            createdAt: string;
            updatedAt: string;
            productId: string;
        };
    }[];
};

export type CreateOrder = {
    shopId: string;
    customerId: string;
    orderItems: {
        productId: string;
        quantity: number;
        productPrice: number;
    }[];
    customerAddress: string;
    orderStatus: OrderStatus;
    notes: string;
    deliveryZoneId: string;
};
