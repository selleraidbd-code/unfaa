"use server";

import { PaginatedResponse, ResponseObject } from "@/types";

import { CustomFetch } from "@/lib/CustomFetch";
import { Product } from "@/types/product-type";

export const getProducts = async ({
  page,
  limit,
}: {
  page?: string;
  limit?: number;
  categoryId?: string;
}) => {
  const url = `/product?limit=${limit || 20}${page ? `&page=${page}` : ""}`;
  console.log("called getProducts", url);
  const products = await CustomFetch<PaginatedResponse<Product>>(url);

  console.log("products", products);

  return products;
};

export const getProductById = async (id: string) => {
  const product = await CustomFetch<ResponseObject<Product>>(`/product/${id}`);
  return product;
};

export const getProductBySlug = async (shopSlug: string, slug: string) => {
  const url = `/product/product-details/${shopSlug}/${slug}`;
  console.log("getProductBySlug called", url);
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
