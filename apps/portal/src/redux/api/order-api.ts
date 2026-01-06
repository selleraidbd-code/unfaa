import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import {
    AIOrderGenerationResult,
    CreateOrder,
    Order,
    UpdateOrderItemsPayload,
    UpdateOrderPayload,
} from "@/types/order-type";

const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createOrderbyAdmin: builder.mutation<void, { assignedTo: string; payload: CreateOrder }>({
            query: ({ assignedTo, payload }) => ({
                url: `/order/admin/${assignedTo}`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Order],
        }),
        getOrders: builder.query<PaginatedResponse<Order>, QueryParams>({
            query: (queryParams) => ({
                url: `/order/`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Order],
        }),
        getOrder: builder.query<ResponseObject<Order>, { id: string }>({
            query: ({ id }) => ({
                url: `/order/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Order],
        }),
        updateOrder: builder.mutation<void, { id: string; payload: UpdateOrderPayload }>({
            query: ({ id, payload }) => ({
                url: `/order/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Order],
        }),
        editOrderItems: builder.mutation<void, { id: string; payload: UpdateOrderItemsPayload }>({
            query: ({ id, payload }) => ({
                url: `/order/manage-items/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Order],
        }),
        deleteOrder: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/order/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Order],
        }),
        bulkDeleteOrders: builder.mutation<void, { ids: string[] }>({
            query: ({ ids }) => ({
                url: `/order/bulk/delete`,
                method: METHOD.DELETE,
                body: { ids },
            }),
            invalidatesTags: [TagType.Order],
        }),
        aiOrderGeneration: builder.mutation<ResponseObject<AIOrderGenerationResult>, { shopId: string; info: string }>({
            query: ({ shopId, info }) => ({
                url: `/ai-generation/order-generation/${shopId}`,
                method: METHOD.POST,
                body: { info },
            }),
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useLazyGetOrdersQuery,
    useGetOrderQuery,
    useLazyGetOrderQuery,
    useCreateOrderbyAdminMutation,
    useUpdateOrderMutation,
    useEditOrderItemsMutation,
    useDeleteOrderMutation,
    useBulkDeleteOrdersMutation,
    useAiOrderGenerationMutation,
} = orderApi;
