import { Category } from "@/types/category-type";

export interface ProductDimensions {
    width: number;
    height: number;
    depth: number;
}

export interface ProductReview {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

export interface ProductMeta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}

export interface ProductVariant {
    id: string;
    name: string;
    isRequired: boolean;
    options: ProductVariantOption[];
}

export interface ProductVariantUpdate {
    name: string;
    isRequired: boolean;
    options?: ProductVariantOptionUpdate[];
}

export interface ProductVariantOptionUpdate {
    id?: string;
    productVariantId: string;
    name: string;
    sku?: string;
    extraPrice?: number;
    imgUrl?: string;
}

export enum ProductActiveStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export interface Product {
    id: string;
    name: string;
    banglaName: string;
    brandId: string;
    description: string;
    fullDescription: string;
    sku?: string;
    price: number | null;
    discountPrice: number | null;
    photoURL: string;
    images: string[];
    keywords: string;
    stock: number;
    createdAt: string;
    activeStatus: ProductActiveStatus;
    updatedAt: string;
    shopId: string;
    unitName?: string;
    warranty?: string;
    deliveryId?: string;
    videoLink: string | null;
    categories: {
        categoryId: string;
        productId: string;
        category: Category;
    }[];
    productVariant: ProductVariant[];
}

export interface ProductCeratePayload {
    name: string;
    banglaName: string;
    description: string;
    fullDescription: string;
    price?: number;
    discountPrice?: number;
    photoURL: string;
    images: string[];
    stock: number;
    activeStatus: "active" | "inactive";
    shopId: string;
    categoryIds: string[];
    productVariant: ProductVariantPayload[];
    unitName?: string;
    warranty?: string;
    sku?: string;
    deliveryId?: string;
}

export interface ProductVariantOption {
    id?: string;
    name: string;
    sku?: string;
    extraPrice?: number;
    imgUrl?: string;
}

export interface ProductVariantPayload {
    name: string;
    isRequired: boolean;
    productVariantOptions: ProductVariantOption[];
}

export interface ProductVariantBulkPayload {
    name: string;
    isRequired: boolean;
    productId: string;
    options: ProductVariantOption[];
}
