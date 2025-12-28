import { DeliveryZone, Product } from "@/types/product-type";

// Product in shop section (junction table)
export type ShopSectionProduct = {
    id: string;
    shopSectionId: string;
    productId: string;
    product: Product;
};

// Category types
export type Category = {
    id: string;
    name: string;
    keywords: string;
    coverImg: string | null;
    description: string | null;
    thumbnailImg: string | null;
    createdAt: string;
    updatedAt: string;
    shopId: string;
    activeStatus: "active" | "inactive";
};

// Shop theme category (junction table)
export type ShopThemeCategory = {
    id: string;
    shopThemeId: string;
    categoryId: string;
    category: Category;
};

// Shop section types
export type ShopSectionType = "productSlider" | "banner" | "category" | "featured";

export type ShopSection = {
    id: string;
    title: string;
    description: string;
    shopSectionType: ShopSectionType;
    index: number;
    shopThemeId: string;
    shouldShow: boolean;
    createdAt: string;
    updatedAt: string;
    products: ShopSectionProduct[];
};

// Shop theme types
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

// Shop types
export type ShopType =
    | "electronics"
    | "clothing"
    | "books"
    | "food"
    | "beauty"
    | "sports"
    | "home"
    | "automotive"
    | "other";

export type ShopStatus = "active" | "inactive" | "underReview" | "suspended" | "pending";

export type Shop = {
    id: string;
    name: string;
    slug: string;
    theme: string;
    description: string;
    photoURL: string;
    banner: string;
    shopType: ShopType;
    createdAt: string;
    updatedAt: string;
    shopOwnerId: string;
    status: ShopStatus;
    landingPageLayout: string[];
    shopTheme: ShopTheme;

    facebookPixelId?: string;
    facebookPixelAccessToken?: string;
    tiktokPixelId?: string;
    tiktokPixelAccessToken?: string;

    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
    youtubeLink?: string;
    tiktokLink?: string;
    darazLink?: string;
    discordLink?: string;
    amazonLink?: string;
    walmartLink?: string;
    linkedInLink?: string;
    whatsappNumber?: string;

    delivery: Delivery[];
};

// Shop owner types
export type ShopOwner = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    shops: Shop[];
};

// Delivery types
export type Delivery = {
    id: string;
    shopId: string;
    scope: string;
    name: string;
    isFree: boolean;
    createdAt: string;
    updatedAt: string;
    isRequired: boolean;
    deliveryZones: DeliveryZone[];
};

// Brand types
export type Brand = {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    isActive: boolean;
    shopId: string;
};

export enum ShopPolicyType {
    PRIVACY_POLICY = "privacyPolicy",
    TERMS_AND_CONDITIONS = "termsAndConditions",
    RETURN_POLICY = "returnPolicy",
    REFUND_POLICY = "refundPolicy",
    ABOUT_US = "aboutUs",
}

export type ShopExtraInfo = {
    id: string;
    privacyPolicy?: string;
    termsAndConditions?: string;
    returnPolicy?: string;
    refundPolicy?: string;
    aboutUs?: string;
};
