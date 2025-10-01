import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";
import { Category } from "@/types/category-type";

import {
    CreateShop,
    Shop,
    ShopExtraInfo,
    ShopPolicyType,
} from "@/types/shop-type";

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
        updateShop: builder.mutation<
            void,
            { id: string; payload: Partial<Shop> }
        >({
            query: ({ id, payload }) => ({
                url: `/shop/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Shop],
        }),
        deleteShop: builder.mutation<void, string>({
            query: (id) => ({
                url: `/shop/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Shop],
        }),
        getShopPolicies: builder.query<
            ResponseObject<ShopExtraInfo>,
            { shopSlug: string; policyType: ShopPolicyType }
        >({
            query: ({ shopSlug, policyType }) => ({
                url: `/shop/extra-info/${shopSlug}/${policyType}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Shop],
        }),
        getShopCategories: builder.query<
            PaginatedResponse<Category>,
            QueryParams
        >({
            query: (queryParams) => ({
                url: `/site-category`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Category],
        }),
    }),
});

export const {
    useCreateShopMutation,
    useGetShopsQuery,
    useGetMyShopQuery,
    useUpdateShopMutation,
    useDeleteShopMutation,
    useGetShopPoliciesQuery,
    useGetShopCategoriesQuery,
} = shopApi;
