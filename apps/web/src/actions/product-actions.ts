"use server";

import { getUrlWithQueryParams } from "@/lib";
import { PaginatedResponse, ResponseObject } from "@/types";

import { Product } from "@/types/product-type";
import { CustomFetch } from "@/lib/CustomFetch";

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
    const product = await CustomFetch<ResponseObject<Product>>(`/product/${id}`);
    return product;
};

export const getProductBySlug = async (shopSlug: string, slug: string) => {
    const url = `/product/product-details/${shopSlug}/${slug}`;
    const product = await CustomFetch<ResponseObject<Product>>(url);
    return product;
};

export const getProductsByShopId = async (shopId: string) => {
    const url = getUrlWithQueryParams("/product", {
        shopId,
        limit: 1000,
    });

    const products = await CustomFetch<PaginatedResponse<Product>>(url);
    return products;
};
