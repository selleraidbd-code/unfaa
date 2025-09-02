import { ProductFormType } from "@/app/(root)/products/create/page";
import { api } from "@/redux/api";
import {
  PaginatedResponse,
  QueryParams,
  ResponseObject,
  METHOD,
  TagType,
} from "@/redux/type";

import {
  Product,
  ProductCeratePayload,
  ProductVariantUpdate,
} from "@/types/product-type";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<void, ProductCeratePayload>({
      query: (payload) => ({
        url: `/product/`,
        method: METHOD.POST,
        body: payload,
      }),
      invalidatesTags: [TagType.Product],
    }),
    getProducts: builder.query<PaginatedResponse<Product>, QueryParams>({
      query: (queryParams) => ({
        url: `/product`,
        method: METHOD.GET,
        params: queryParams,
      }),
      providesTags: [TagType.Product],
    }),
    getProduct: builder.query<
      ResponseObject<Product>,
      { shopName: string; slug: string }
    >({
      query: ({ shopName, slug }) => ({
        url: `/product/${shopName}/${slug}`,
        method: METHOD.GET,
      }),
      providesTags: [TagType.Product],
    }),
    getProductById: builder.query<ResponseObject<Product>, { id: string }>({
      query: ({ id }) => ({
        url: `/product/${id}`,
        method: METHOD.GET,
      }),
      providesTags: [TagType.Product],
    }),
    updateProduct: builder.mutation<
      void,
      { id: string; payload: ProductFormType }
    >({
      query: ({ id, payload }) => ({
        url: `/product/${id}`,
        method: METHOD.PATCH,
        body: payload,
      }),
      invalidatesTags: [TagType.Product],
    }),
    updateProductVariant: builder.mutation<
      void,
      { id: string; payload: ProductVariantUpdate }
    >({
      query: ({ id, payload }) => ({
        url: `/product-variant/${id}`,
        method: METHOD.PATCH,
        body: payload,
      }),
    }),
    deleteProduct: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/product/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.Product],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductVariantMutation,
  useDeleteProductMutation,
} = productApi;
