export interface Category {
    id: string;
    name: string;
    keywords: string;
    coverImg?: string;
    description?: string;
    thumbnailImg?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategory {
    name: string;
    keywords: string;
    shopId: string;
}
