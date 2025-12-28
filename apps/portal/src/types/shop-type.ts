import { Category } from "@/types/category-type";
import { Product } from "@/types/product-type";

export type CreateShop = {
    name: string;
    description: string;
    banner?: string;
    photoURL?: string;
    shopType: ShopType;
    shopIdToClone: string;
};

export enum ShopType {
    CLOTHING_APPAREL = "clothing_apparel",
    SHOES_FOOTWEAR = "shoes_footwear",
    ACCESSORIES_JEWELRY = "accessories_jewelry",
    BEAUTY_COSMETICS = "beauty_cosmetics",
    ELECTRONICS_GADGETS = "electronics_gadgets",
    HEALTH_WELLNESS = "health_wellness",
    HOME_FURNITURE = "home_furniture",
    BOOKS_MEDIA = "books_media",
    TOYS_GAMES = "toys_games",
    SPORTS_OUTDOORS = "sports_outdoors",
    FOOD_BEVERAGES = "food_beverages",
    PET_SUPPLIES_EQUIPMENT = "pet_supplies_equipment",
    GROCERIES_HOUSEHOLD = "groceries_household",
    OTHER = "other",
}

export type Shop = {
    id: string;
    slug: string;
    name: string;
    description: string;
    shopType: ShopType;
    banner: string;
    photoURL: string;
    theme?: string;
    shopOwnerId: string;
    merchantId?: string;
    status: string;
    createdAt: string;
    updatedAt: string;

    facebookPixelId?: string;
    facebookPixelAccessToken?: string;
    tiktokPixelId?: string;
    tiktokPixelAccessToken?: string;

    shopEmail?: string;
    whatsappNumber?: string;
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

    termsAndConditions?: string;
    privacyPolicy?: string;
    returnPolicy?: string;
    refundPolicy?: string;
    aboutUs?: string;
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
    shouldShow: boolean;
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
    ABOUT_US = "aboutUs",
}

export type ShopExtraInfo = {
    id: string;
    shopId: string;
    privacyPolicy: string;
    termsAndConditions: string;
    returnPolicy: string;
    refundPolicy: string;
    aboutUs: string;
};
