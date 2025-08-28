import { api } from "@/redux/api";
import {
    PaginatedResponse,
    ResponseObject,
    METHOD,
    TagType,
    QueryParams,
} from "@/redux/type";

import { CreateShop, Shop } from "@/types/shop-type";
import { ShopTheme } from "@/features/manage-shop/types";

const shopApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createShop: builder.mutation<void, CreateShop>({
            query: (payload) => ({
                url: `/shop/`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Shop],
        }),
        getShops: builder.query<PaginatedResponse<Shop>, QueryParams>({
            query: (params) => ({
                url: `/shop/`,
                method: METHOD.GET,
                params,
            }),
            providesTags: [TagType.Shop],
        }),
        getMyShop: builder.query<ResponseObject<Shop>, void>({
            query: () => ({
                url: `/shop/my-shop/`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Shop],
        }),
        updateShop: builder.mutation<void, Partial<Shop>>({
            query: (payload) => ({
                url: `/shop/${payload.id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Shop],
        }),
        getShopTheme: builder.query<PaginatedResponse<ShopTheme>, void>({
            query: () => ({
                url: `/shop-theme`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Shop],
        }),
        createShopTheme: builder.mutation<void, ShopTheme>({
            query: (payload) => ({
                url: `/shop-theme`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        deleteShop: builder.mutation<void, string>({
            query: (id) => ({
                url: `/shop/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Shop],
        }),
    }),
});

export const {
    useCreateShopMutation,
    useGetShopsQuery,
    useGetShopThemeQuery,
    useGetMyShopQuery,
    useUpdateShopMutation,
    useDeleteShopMutation,
    useCreateShopThemeMutation,
} = shopApi;
