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
