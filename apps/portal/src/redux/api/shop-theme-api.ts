import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, ResponseObject, TagType } from "@/redux/type";

import { UpdateShopSectionCorePayload } from "@/types/shop-theme";
import { ShopTheme, updateCoreThemePayload } from "@/types/shop-type";

const shopApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getThemes: builder.query<PaginatedResponse<ShopTheme>, void>({
            query: () => ({
                url: `/shop-theme`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.ShopTheme],
        }),
        getShopTheme: builder.query<ResponseObject<ShopTheme>, { shopId: string }>({
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
        updateCoreTheme: builder.mutation<void, { id: string; payload: updateCoreThemePayload }>({
            query: (data) => ({
                url: `/shop-theme/core/${data.id}`,
                method: METHOD.PATCH,
                body: data.payload,
            }),
            invalidatesTags: [TagType.ShopTheme],
        }),
        updateShopThemeCategory: builder.mutation<void, { shopThemeId: string; categoryIds: string[] }>({
            query: (data) => ({
                url: `/shop-theme/change-shop-theme-categories`,
                method: METHOD.PATCH,
                body: data,
            }),
            invalidatesTags: [TagType.ShopTheme],
        }),
        updateShopThemeSectionProducts: builder.mutation<
            void,
            { shopThemeId: string; shopSectionId: string; productIds: string[] }
        >({
            query: (data) => ({
                url: `/shop-theme/shop-section/change-shop-section-products`,
                method: METHOD.PATCH,
                body: data,
            }),
            invalidatesTags: [TagType.ShopTheme],
        }),
        updateShopSectionCore: builder.mutation<
            void,
            { sectionId: string; payload: Partial<UpdateShopSectionCorePayload> }
        >({
            query: (data) => ({
                url: `/shop-section/${data.sectionId}?fullUpdate=true`,
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
    useUpdateShopThemeCategoryMutation,
    useUpdateShopThemeSectionProductsMutation,
    useUpdateShopSectionCoreMutation,
} = shopApi;
