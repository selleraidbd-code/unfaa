import { Shop } from "@/types/shop-type";
import { SubscriptionPlan } from "@/types/subscription-plan-type";

export enum ShopSubscriptionStatus {
    ACTIVE = "active",
    UNDER_REVIEW = "underReview",
    EXPIRED = "expired",
}

export interface ShopSubscription {
    id: string;
    shopId: string;
    subscriptionId: string;
    refaranceId: string;
    status: ShopSubscriptionStatus;
    createdAt: string;
    updatedAt: string;
    shop?: Shop;
    subscription?: SubscriptionPlan;
}

export interface ShopSubscriptionCreatePayload {
    shopId: string;
    subscriptionId: string;
    refaranceId: string;
    status?: ShopSubscriptionStatus;
}
