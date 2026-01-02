import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import { CreatePackagePayload, Package } from "@/types/package-type";

const packageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPackage: builder.mutation<ResponseObject<Package>, CreatePackagePayload>({
            query: (payload) => ({
                url: `/package`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Product],
        }),
        getPackages: builder.query<PaginatedResponse<Package>, QueryParams>({
            query: (queryParams) => ({
                url: `/package`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Product],
        }),
        getPackagesByProductId: builder.query<
            PaginatedResponse<Package>,
            { productId: string; queryParams?: QueryParams }
        >({
            query: ({ productId, queryParams }) => ({
                url: `/package/product/${productId}`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Product],
        }),
        getPackage: builder.query<ResponseObject<Package>, { id: string }>({
            query: ({ id }) => ({
                url: `/package/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Product],
        }),
        updatePackage: builder.mutation<void, { id: string; payload: Partial<CreatePackagePayload> }>({
            query: ({ id, payload }) => ({
                url: `/package/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Product],
        }),
        deletePackage: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/package/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Product],
        }),
    }),
});

export const {
    useCreatePackageMutation,
    useGetPackagesQuery,
    useGetPackageQuery,
    useGetPackagesByProductIdQuery,
    useUpdatePackageMutation,
    useDeletePackageMutation,
} = packageApi;
