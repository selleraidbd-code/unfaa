export type CourierType = "steadfast" | "pathao" | "redx" | "paperfly";

export interface CourierCredentials {
    steadfast?: {
        steadFastAPIKey: string;
        steadFastAPISecret: string;
    };
    pathao?: {
        storeId: string;
        clientId: string;
        clientSecret: string;
    };
    redx?: {
        apiKey: string;
    };
    paperfly?: {
        username: string;
        password: string;
    };
}

export interface CourierSetup {
    id: string;
    shopId: string;
    courierType?: CourierType;
    credentials?: CourierCredentials;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
    // Direct credential fields (as returned by API)
    steadFastAPIKey?: string;
    steadFastAPISecret?: string;
    storeId?: string;
    clientId?: string;
    clientSecret?: string;
    apiKey?: string;
    username?: string;
    password?: string;
}

export interface CreateCourierSetup {
    shopId: string;
    // SteadFast fields
    steadFastAPIKey?: string;
    steadFastAPISecret?: string;
    // Pathao fields
    storeId?: string;
    clientId?: string;
    clientSecret?: string;
    // REDX fields
    apiKey?: string;
    // Paperfly fields
    username?: string;
    password?: string;
}

export interface UpdateCourierSetup {
    id: string;
    credentials: CourierCredentials;
    isActive?: boolean;
}

export interface RiderNote {
    consignmentId: string;
    createdAt: string;
    deliveryStatus: string;
    id: string;
    notificationType: string;
    orderId: string;
    trackingMessage: string;
    updatedAt: string;
}
