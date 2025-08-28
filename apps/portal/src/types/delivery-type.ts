export interface Delivery {
    id: string;
    shopId: string;
    scope: string;
    name: string;
    isFree: boolean;
    createdAt: string;
    updatedAt: string;
    isRequired: boolean;
    deliveryZones: {
        id: string;
        name: string;
        fee: number;
        isFree: boolean;
        deliveryId: string;
        createdAt: string;
        updatedAt: string;
    }[];
}

export interface UpdateDelivery {
    id: string;
    payload: {
        name: string;
        imgURL: string;
    };
}

export interface CreateDelivery {
    name: string;
    imgURL: string;
    shopId: string;
}
