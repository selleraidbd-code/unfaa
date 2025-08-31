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
    categories: string[];
    // shopSection: ShopSection[];
};

export type updateCoreThemePayload = {
    bannerImg: string[];
};
