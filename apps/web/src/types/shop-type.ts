// Product types
export type Product = {
    id: string;
    name: string;
    banglaName: string;
    slug: string;
    description: string;
    fullDescription: string;
    sku: string;
    price: number;
    discountPrice: number;
    unitName: string;
    warranty: string;
    photoURL: string;
    images: string[];
    videoLink: string | null;
    activeStatus: "active" | "inactive";
    keywords: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
    shopId: string;
    deliveryId: string;
    brandId: string;
};

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
export type ShopSectionType =
    | "productSlider"
    | "banner"
    | "category"
    | "featured";

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
export type ShopThemeType = "minimal" | "modern" | "classic" | "elegant";

export type ShopTheme = {
    id: string;
    shopId: string;
    shopThemeType: ShopThemeType;
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

export type ShopStatus =
    | "active"
    | "inactive"
    | "underReview"
    | "suspended"
    | "pending";

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
    name: string;
    description?: string;
    price: number;
    estimatedDays: number;
    isActive: boolean;
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
