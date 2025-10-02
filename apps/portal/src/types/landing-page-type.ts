import { Section } from "@workspace/ui/landing/types";

export enum LANDING_PAGE {
    PRODUCT = "PRODUCT",
    HERO_TWO_COLUMNS = "HERO_TWO_COLUMNS",
    INGREDIENT_IMAGE_DESCRIPTION = "INGREDIENT_IMAGE_DESCRIPTION",
    INGREDIENT_IMAGE_LIST = "INGREDIENT_IMAGE_LIST",
    INGREDIENT_ITEMS = "INGREDIENT_ITEMS",
    FEATURES_TWO_DESCRIPTION = "FEATURES_TWO_DESCRIPTION",
    FEATURES_DESCRIPTION_LIST = "FEATURES_DESCRIPTION_LIST",
    TESTIMONIALS = "TESTIMONIALS",
    HOW_IT_WORKS = "HOW_IT_WORKS",
    FAQ = "FAQ",
    YOUTUBE_GALLERY = "YOUTUBE_GALLERY",
}

export type ILandingPage = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
};

export type LANDING_PAGE_SECTION = {
    [key in LANDING_PAGE]: boolean | undefined;
};

// export type IFieldLabel & ISection
export interface IFieldLabel {
    id: string;
    componentName: string;
    title?: string;
    subTitle?: string;
    imgURL?: string;
    bgURL?: string;
    description?: string;
    customizeDescription?: string;
    buttonText?: string;
    buttonUrl?: string;
    sectionList: {
        id: string;
        title?: string;
        subTitle?: string;
        imgURL?: string;
        bgURL?: string;
        description?: string;
        customizeDescription?: string;
        buttonText?: string;
        buttonUrl?: string;
        booleanValue?: boolean;
    };
}

export enum SiteType {
    PORTFOLIO = "portfolio",
    TEMPLATE = "template",
}

export type LandingPage = {
    id: string;
    shopId: string;
    productId: string;
    metaData: null;
    name: string;
    slug: string;
    keyword: string;
    createdAt: string;
    updatedAt: string;
};

export type LandingPageDemo = {
    id: string;
    name: string;
    slug: string;
    imgURL: string;
    keyword: string;
    theme: string;
    createdAt: string;
    updatedAt: string;
    metaData: null;
    section: Section[];
};
