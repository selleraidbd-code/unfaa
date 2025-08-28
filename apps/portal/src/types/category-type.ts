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

export interface CategoryFormSchema {
    name: string;
    keywords: string;
    description?: string;
    thumbnailImg?: string;
    coverImg?: string;
}

export interface CreateCategory {
    name: string;
    keywords: string;
    shopId: string;
}
