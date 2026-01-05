import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import { CourierSetup, CreateCourierSetup, RiderNote } from "@/types/courier-type";

const courierApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCourierSetup: builder.mutation<void, CreateCourierSetup>({
            query: (payload) => ({
                url: `/shop-courier-setup`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Courier],
        }),
        courierEntry: builder.mutation<void, { ids: string[]; shopId: string }>({
            query: (payload) => ({
                url: `/order/courior-entry/${payload.shopId}`,
                method: METHOD.POST,
                body: { ids: payload.ids },
            }),
            invalidatesTags: [TagType.Order],
        }),
        getCourierSetup: builder.query<ResponseObject<CourierSetup>, { shopId: string }>({
            query: ({ shopId }) => ({
                url: `/shop-courier-setup/${shopId}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Courier],
        }),
        getSteadfastRiderNote: builder.query<PaginatedResponse<RiderNote>, QueryParams>({
            query: (params) => ({
                url: `/stead-fast-courier-webhook-response`,
                method: METHOD.GET,
                params,
            }),
        }),
        reCheckCourierStatus: builder.mutation<void, { shopId: string }>({
            query: ({ shopId }) => ({
                url: `/order/re-check-courior-status/${shopId}`,
                method: METHOD.PATCH,
            }),
            invalidatesTags: [TagType.Order],
        }),
    }),
});

export const {
    useCreateCourierSetupMutation,
    useCourierEntryMutation,
    useGetCourierSetupQuery,
    useGetSteadfastRiderNoteQuery,
    useReCheckCourierStatusMutation,
} = courierApi;
