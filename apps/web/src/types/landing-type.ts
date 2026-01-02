import { EPageType, Section } from "@workspace/ui/landing/types";

import { Product } from "@/types/product-type";

export type LandingPage = {
    id: string;
    shopId: string;
    productId: string;
    metaData: Record<string, unknown> | Record<string, unknown>[];
    name: string;
    slug: string;
    pageType: EPageType;
    keyword: string;
    createdAt: Date;
    updatedAt: Date;
    product: WithProductPackage;
    section: Section[];
    featureProducts: FeatureProduct[];
};

export type WithProductPackage = Product & {
    package: Package[];
};

export type Package = {
    id: string;
    title: string;
    img: string;
    codAmount: number;
    saveAmount: number;
    createdAt: string;
    updatedAt: string;
    shopId: string;
    productId: string;
    packageProducts: PackageProduct[];
};

export type PackageProduct = {
    id: string;
    packageId: string;
    productId: string;
    quantity: number;
    packageProductVariants: PackageProductVariant[];
};

export type PackageProductVariant = {
    productVariantId: string;
    productVariantOptionId: string;
};

export type FeatureProduct = {
    productId: string;
    product: Product;
};
