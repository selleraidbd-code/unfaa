import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/type";
import { PaginatedResponse, QueryParams } from "@/redux/type";

import { Category, CategoryFormSchema } from "@/types/category-type";

const siteCategoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createSiteCategory: builder.mutation<void, { name: string }>({
            query: (payload) => ({
                url: `/site-category`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Category],
        }),
        getSiteCategories: builder.query<
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
        getSiteCategory: builder.query<
            ResponseObject<Category>,
            { id: string }
        >({
            query: ({ id }) => ({
                url: `/site-category/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Category],
        }),
        updateSiteCategory: builder.mutation<
            void,
            { id: string; payload: CategoryFormSchema }
        >({
            query: ({ id, payload }) => ({
                url: `/site-category/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Category],
        }),
        deleteSiteCategory: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/site-category/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Category],
        }),
    }),
});

export const {
    useGetSiteCategoriesQuery,
    useCreateSiteCategoryMutation,
    useGetSiteCategoryQuery,
    useUpdateSiteCategoryMutation,
    useDeleteSiteCategoryMutation,
} = siteCategoryApi;
