"use server";

import { PaginatedResponse, ResponseObject } from "@/types";

import { CustomFetch } from "@/lib/CustomFetch";
import { Product } from "@/types/product-type";
import { getUrlWithQueryParams } from "@/lib";

export const getProducts = async ({
    page,
    limit,
    categoryId,
    searchTerm,
    shopId,
    minPrice,
    maxPrice,
}: {
    page?: string;
    limit?: number;
    categoryId?: string;
    searchTerm?: string;
    shopId?: string;
    minPrice?: string;
    maxPrice?: string;
}) => {
    const url = getUrlWithQueryParams("/product", {
        limit: limit || 20,
        page,
        categoryId,
        searchTerm,
        shopId,
        minPrice,
        maxPrice,
    });

    const products = await CustomFetch<PaginatedResponse<Product>>(url);

    return products;
};

export const getProductById = async (id: string) => {
    const product = await CustomFetch<ResponseObject<Product>>(
        `/product/${id}`
    );
    return product;
};

export const getProductBySlug = async (shopSlug: string, slug: string) => {
    const url = `/product/product-details/${shopSlug}/${slug}`;
    const product = await CustomFetch<ResponseObject<Product>>(url);
    return product;
};

// export const getAllProducts = async (): Promise<PaginatedResponse<Product>> => {
//     const products = await fetch(`${config.serverUrl}/product?shopId=${config.shopId}&limit=500`, {
//         next: {
//             revalidate: 3600,
//         },
//     });

//     const data = await products.json();
//     return data;
// };
