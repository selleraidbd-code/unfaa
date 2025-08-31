import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    ResponseObject,
    TagType,
} from "@/redux/type";

import {
    ShopTheme,
    updateCoreThemePayload,
} from "@/features/manage-shop/types";

const shopApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getThemes: builder.query<PaginatedResponse<ShopTheme>, void>({
            query: () => ({
                url: `/shop-theme`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.ShopTheme],
        }),
        getShopTheme: builder.query<
            ResponseObject<ShopTheme>,
            { shopId: string }
        >({
            query: (data) => ({
                url: `/shop-theme/${data.shopId}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.ShopTheme],
        }),
        createShopTheme: builder.mutation<void, ShopTheme>({
            query: (payload) => ({
                url: `/shop-theme`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.ShopTheme],
        }),
        updateCoreTheme: builder.mutation<
            void,
            { id: string; payload: updateCoreThemePayload }
        >({
            query: (data) => ({
                url: `/shop-theme/core/${data.id}`,
                method: METHOD.PATCH,
                body: data.payload,
            }),
            invalidatesTags: [TagType.ShopTheme],
        }),
    }),
});

export const {
    useGetThemesQuery,
    useGetShopThemeQuery,
    useCreateShopThemeMutation,
    useUpdateCoreThemeMutation,
} = shopApi;
