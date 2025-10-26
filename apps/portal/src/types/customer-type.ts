export interface Customer {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomer {
    shopId: string;
    name: string;
    email?: string;
    phoneNumber: string;
    address?: string;
}

export interface UpdateCustomer {
    id: string;
    payload: {
        name: string;
        email?: string;
        address?: string;
    };
}

export interface FraudCheckerData {
    mobile_number: string;
    total_parcels: number;
    total_delivered: number;
    total_cancel: number;
    apis: {
        [courierName: string]: {
            total_parcels: number;
            total_delivered_parcels: number;
            total_cancelled_parcels: number;
        };
    };
}
