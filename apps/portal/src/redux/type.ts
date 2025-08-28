import { store } from "@/redux/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export enum TagType {
    User = "User",
    Shop = "Shop",
    Product = "Product",
    Category = "Category",
    Brand = "Brand",
    Order = "Order",
    Customer = "Customer",
    LandingPage = "LandingPage",
    Component = "Component",
    Media = "Media",
    Plan = "Plan",
    Payment = "Payment",
    Tutorial = "Tutorial",
    Delivery = "Delivery",
}

export const tagTypes = Object.values(TagType);

export const METHOD = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
};

export interface IMeta {
    limit: number;
    page: number;
    total: number;
}

export type PaginatedResponse<T> = {
    data: T[];
    meta?: IMeta;
    success: boolean;
    message: string;
    statusCode: number;
};

export type ResponseObject<T> = {
    data: T;
    message: string;
    success: boolean;
    statusCode: number;
};

export type ErrorResponse = {
    success: boolean;
    message: string;
    errorMessages: {
        path: string;
        message: string;
    }[];
    stack: string;
};

export type QueryParams = {
    [key: string]: string | string[] | number | undefined;
};
