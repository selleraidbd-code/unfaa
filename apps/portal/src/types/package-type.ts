export interface PackageProductVariant {
    productVariantId: string;
    productVariantOptionId: string;
}

export interface PackageProduct {
    productId: string;
    quantity: number;
    variants: PackageProductVariant[];
}

export interface CreatePackagePayload {
    title: string;
    img: string;
    codAmount: number;
    saveAmount: number;
    shopId: string;
    productId: string;
    packageProducts: PackageProduct[];
}

export interface Package {
    id: string;
    title: string;
    img: string;
    codAmount: number;
    saveAmount: number;
    shopId: string;
    packageProducts: PackageProduct[];
    createdAt: string;
    updatedAt: string;
}
