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

export enum CourierStatus {
    PENDING = "pending",
    IN_REVIEW = "in_review",
    DELIVERED = "Delivered",
    PARTIAL_DELIVERED = "partial_delivered",
    CANCELLED = "cancelled",
    UNKNOWN = "unknown",
}

export type Order = {
    id: string;
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    notes: string;
    courierNote: string | null;
    courierStatus: CourierStatus | null;
    consignmentId: string | null;
    shopId: string;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    orderNumber: number;
    totalAmount: number;
    discountedPrice: number | null;
    createdAt: string;
    updatedAt: string;
    customer: CustomerOrders;
    orderItems: OrderDetailsItem[];
    customerTotalCancelOrder: number;
    customerTotalConfirmOrder: number;
};

export interface CustomerOrders {
    id: string;
    _count: {
        orders: number;
    };
    orders: CustomerOrderItem[];
}

export interface CustomerOrderItem {
    id: string;
    orderStatus: OrderStatus;
    courierStatus: CourierStatus | null;
    discountedPrice: number | null;
    totalAmount: number | null;
    createdAt: string;
    customerName: string;
    orderItems: {
        quantity: number;
        productName: string | null;
        productImage: string | null;
        productPrice: number;
        orderItemVariant: CustomerOrderItemVariant[];
    }[];
}

export interface CustomerOrderItemVariant {
    productVariantName: string | null;
    productVariantOptionName: string | null;
    productVariantOptionExtraPrice: number;
}

export interface OrderDetailsItem {
    id: string;
    orderId: string;
    quantity: number;
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string | null;
    createdAt: string;
    updatedAt: string;
    orderItemVariant: OrderItemVariant[];
}

export interface OrderItemVariant {
    id: string;
    productVariantId: string;
    productVariantOptionId: string;
    productVariantOptionExtraPrice: number;
    productVariantName: string | null;
    productVariantOptionName: string | null;
    orderItemId: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    selectedVariants?: {
        variantId: string;
        variantName: string;
        optionId: string;
        optionName: string;
        extraPrice: number;
    }[];
}

export type CreateOrder = {
    shopId: string;
    customerId: string;
    customerName?: string;
    customerPhoneNumber?: string;
    orderItems: {
        productId: string;
        quantity: number;
        productPrice: number;
        orderItemVariant: {
            productVariantId: string;
            productVariantOptionId: string;
        }[];
    }[];
    customerAddress: string;
    orderStatus: OrderStatus;
    notes: string;
    deliveryZoneId: string;
    discountedPrice?: number | null;
    customerTotalConfirmOrder: number;
    customerTotalCancelOrder: number;
};

export interface CustomItem {
    name: string;
    price: number;
    quantity: number;
}

export type UpdateOrderPayload = {
    orderStatus?: OrderStatus;
    customerName?: string;
    customerPhoneNumber?: string;
    customerAddress?: string;
    quantity?: number;
    notes?: string;
    discountedPrice?: number;
};

// AI Order Generation Types
export interface AIOrderGenerationProductInfo {
    productId: string | null;
    productName: string;
    productQuantity: number;
}

export interface AIOrderGenerationData {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerId: string | null;
    overallPrice: number | null;
    productInfo: AIOrderGenerationProductInfo[];
}

export interface AIOrderGenerationResult {
    result: {
        missingFields: string[];
        data: AIOrderGenerationData;
    };
}

export interface OrderDetailsType {
    deliveryZoneId: string;
    discountedPrice?: number | null;
}
