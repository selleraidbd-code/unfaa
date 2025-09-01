import { Category } from "@/types/category-type";

export type CreateShop = {
  name: string;
  description: string;
  banner: string;
  photoURL: string;
};

export type Shop = {
  id: string;
  name: string;
  description: string;
  banner: string;
  photoURL: string;
  shopOwnerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ShopSection = {
  title: string;
  description: string;
  shopSectionType: string;
  index: number;
  products: string[];
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
