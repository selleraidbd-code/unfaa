export enum shopThemeType {
    MINIMAL = "minimal",
    MODERN = "modern",
    CLASSIC = "classic",
}

export type ShopTheme = {
    shopId: string;
    shopThemeType: shopThemeType;
    bannerImg: string[];
    categories: string[];
    // shopSection: ShopSection[];
};
