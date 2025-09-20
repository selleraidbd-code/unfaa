"use server";

import { PaginatedResponse } from "@/types";

import { getUrlWithQueryParams } from "@/lib";
import { CustomFetch } from "@/lib/CustomFetch";
import { Brand } from "@/types/shop-type";

export const getBrands = async ({
    page,
    limit,
    brandId,
    shopId,
}: {
    page?: string;
    limit?: number;
    brandId?: string;
    shopId?: string;
}) => {
    const url = getUrlWithQueryParams("/brand", {
        limit: limit || 30,
        page,
        brandId,
        shopId,
    });

    const brands = await CustomFetch<PaginatedResponse<Brand>>(url);

    return brands;
};
