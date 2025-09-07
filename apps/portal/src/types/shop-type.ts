import { Category } from "@/types/category-type";
import { Product } from "@/types/product-type";

export type CreateShop = {
    name: string;
    description: string;
    banner: string;
    photoURL: string;
};

export type Shop = {
    id: string;
    slug: string;
    name: string;
    description: string;
    banner: string;
    photoURL: string;
    shopOwnerId: string;
    status: string;
    termsAndConditions?: string;
    returnPolicy?: string;
    refundPolicy?: string;
    privacyPolicy?: string;
    createdAt: string;
    updatedAt: string;
};

export type ShopThemeProduct = {
    id: string;
    shopThemeId: string;
    productId: string;
    product: Product;
};

export enum ShopSectionType {
    PRODUCTS = "productSlider",
}

export type ShopSection = {
    id: string;
    title: string;
    description: string;
    shopSectionType: ShopSectionType;
    index: number;
    shopThemeId: string;
    products: ShopThemeProduct[];
};

export type ShopThemeCategory = {
    id: string;
    shopThemeId: string;
    categoryId: string;
    category: Category;
};

export enum shopThemeType {
    MINIMAL = "minimal",
    MODERN = "modern",
    CLASSIC = "classic",
}

export type ShopTheme = {
    id: string;
    shopId: string;
    shopThemeType: shopThemeType;
    bannerImg: string[];
    shouldBannerShow: boolean;
    shouldCategoryShow: boolean;
    createdAt: string;
    updatedAt: string;
    shopSection: ShopSection[];
    categories: ShopThemeCategory[];
};

export type updateCoreThemePayload = {
    bannerImg: string[];
};

export enum ShopPolicyType {
    PRIVACY_POLICY = "privacyPolicy",
    TERMS_AND_CONDITIONS = "termsAndConditions",
    RETURN_POLICY = "returnPolicy",
    REFUND_POLICY = "refundPolicy",
}

export type ShopExtraInfo = {
    id: string;
    shopId: string;
    privacyPolicy: string;
    termsAndConditions: string;
    returnPolicy: string;
    refundPolicy: string;
};
