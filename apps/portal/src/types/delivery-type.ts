export enum DeliveryScope {
    PRODUCT_SPECIFIC = "PRODUCT_SPECIFIC",
    GLOBAL = "GLOBAL",
}

export interface Delivery {
    id: string;
    shopId: string;
    scope: DeliveryScope;
    name: string;
    isFree: boolean;
    createdAt: string;
    updatedAt: string;
    deliveryZones: DeliveryZone[];
}

export interface DeliveryZone {
    id: string;
    name: string;
    fee: number;
    isFree: boolean;
    deliveryId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDelivery {
    name: string;
    scope: DeliveryScope;
    isFree: boolean;
    shopId: string;
    deliveryZones: CreateDeliveryZone[];
}

export interface UpdateDelivery {
    id: string;
    payload: {
        name: string;
        scope: DeliveryScope;
        isFree: boolean;
        deliveryZones: UpdateDeliveryZone[];
    };
}

export interface CreateDeliveryZone {
    name: string;
    fee: number;
    isFree: boolean;
}

export interface UpdateDeliveryZone {
    id?: string;
    name: string;
    fee: number;
    isFree: boolean;
}
