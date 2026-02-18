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

export type TrackingData = {
    fbp?: string;
    fbc?: string;
    eventId?: string;
    ttclid?: string;
    ttp?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    utmId?: string;
    fbclid?: string;
    phRaw?: string;
    phHashed?: string;
    emailHashed?: string;
    pageUrl?: string;
    referrerUrl?: string;
};

export enum OrderSource {
    AI_ORDER = "aiOrder",
    MANUAL_ORDER = "manualOrder",
    WEBSITE_FACEBOOK = "websiteFacebook",
    WEBSITE_TIKTOK = "websiteTiktok",
    LANDING_PAGE_FACEBOOK = "landingPageFacebook",
    LANDING_PAGE_TIKTOK = "landingPageTiktok",
    WEBSITE = "website",
}

export type CreateOrderPayload = {
    shopId: string;
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    deliveryZoneId: string;
    orderStatus: OrderStatus;
    orderSource: OrderSource;
    orderItems: {
        productId: string;
        quantity: number;
        orderItemVariant: {
            productVariantId: string;
            productVariantOptionId: string;
        }[];
    }[];
    trackingData?: TrackingData | null;
    discountedPrice?: number | null;
    notes?: string;
};

export type OrderResponse = {
    id: string;
    shopId: string;
    discountedPrice: number | null;
    orderItems: {
        id: string;
        productId: string;
        productName: string;
        productPrice: number;
        productVariant?: ProductVariant;
        quantity: number;
    }[];
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    orderSerialNumber: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentId: string;
    updatedAt: string;
};
