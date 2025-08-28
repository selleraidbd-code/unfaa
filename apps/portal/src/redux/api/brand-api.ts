import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";

import { Brand, CreateBrand, UpdateBrand } from "@/types/brand-type";

const brandApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createBrand: builder.mutation<void, CreateBrand>({
            query: (payload) => ({
                url: `/brand/`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Brand],
        }),
        getBrands: builder.query<PaginatedResponse<Brand>, QueryParams>({
            query: (queryParams) => ({
                url: `/brand`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Brand],
        }),
        getBrand: builder.query<ResponseObject<Brand>, { id: string }>({
            query: ({ id }) => ({
                url: `/brand/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Brand],
        }),
        updateBrand: builder.mutation<void, UpdateBrand>({
            query: ({ id, payload }) => ({
                url: `/brand/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Brand],
        }),
        deleteBrand: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/brand/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Brand],
        }),
    }),
});

export const {
    useGetBrandsQuery,
    useGetBrandQuery,
    useCreateBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = brandApi;
