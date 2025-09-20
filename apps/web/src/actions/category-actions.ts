"use server";

import { PaginatedResponse } from "@/types";

import { getUrlWithQueryParams } from "@/lib";
import { CustomFetch } from "@/lib/CustomFetch";
import { Category } from "@/types/shop-type";

export const getCategories = async ({
    page,
    limit,
    categoryId,
    shopId,
}: {
    page?: string;
    limit?: number;
    categoryId?: string;
    shopId?: string;
}) => {
    const url = getUrlWithQueryParams("/category", {
        limit: limit || 30,
        page,
        categoryId,
        shopId,
    });

    const categories = await CustomFetch<PaginatedResponse<Category>>(url);

    return categories;
};
