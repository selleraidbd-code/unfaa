export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    duration: number;
    durationName?: string;
    isFree: boolean;
    isTrial: boolean;
    features: string[];
    description?: string;
    status?: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSubscriptionPlanPayload {
    name: string;
    price: number;
    discountPrice?: number;
    duration: number;
    durationName?: string;
    isFree: boolean;
    isTrial: boolean;
    features: string[];
    description?: string;
}

export type UpdateSubscriptionPlanPayload = Partial<CreateSubscriptionPlanPayload>;
