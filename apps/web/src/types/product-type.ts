import { Category } from "@/types/shop-type";

export type Product = {
    id: string;
    name: string;
    banglaName: string;
    slug: string;
    description: string;
    fullDescription: string;
    sku: string;
    categories: CategoryTheme[];
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
    delivery: {
        deliveryZones: DeliveryZone[];
    };
};

export type CategoryTheme = {
    categoryId: string;
    productId: string;
    category: Category;
};

export type DeliveryZone = {
    id: string;
    name: string;
    fee: number;
    deliveryId: string;
    isFree: boolean;
    createdAt: string;
    updatedAt: string;
};
