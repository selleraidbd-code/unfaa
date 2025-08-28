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
