import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";

import {
    Delivery,
    CreateDelivery,
    UpdateDelivery,
} from "@/types/delivery-type";

const deliveryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDelivery: builder.mutation<void, CreateDelivery>({
            query: (payload) => ({
                url: `/delivery/`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Delivery],
        }),
        getDeliveries: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (queryParams) => ({
                url: `/delivery`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Delivery],
        }),
        getDelivery: builder.query<ResponseObject<Delivery>, { id: string }>({
            query: ({ id }) => ({
                url: `/delivery/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Delivery],
        }),
        updateDelivery: builder.mutation<void, UpdateDelivery>({
            query: ({ id, payload }) => ({
                url: `/delivery/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Delivery],
        }),
        deleteDelivery: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/delivery/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Delivery],
        }),
    }),
});

export const {
    useGetDeliveriesQuery,
    useGetDeliveryQuery,
    useCreateDeliveryMutation,
    useUpdateDeliveryMutation,
    useDeleteDeliveryMutation,
} = deliveryApi;
