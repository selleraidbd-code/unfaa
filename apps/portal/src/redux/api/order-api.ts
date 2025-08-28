import { api } from "@/redux/api";
import { PaginatedResponse, QueryParams, METHOD, TagType } from "@/redux/type";

import { CreateOrder, Order } from "@/types/order-type";

const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createOrderbyAdmin: builder.mutation<
            void,
            { assignedTo: string; payload: CreateOrder }
        >({
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
        getOrder: builder.query<Order, { id: string }>({
            query: ({ id }) => ({
                url: `/order/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Order],
        }),
        updateOrder: builder.mutation<
            void,
            { id: string; payload: { status: string } }
        >({
            query: ({ id, payload }) => ({
                url: `/order/${id}`,
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
    }),
});

export const {
    useGetOrdersQuery,
    useCreateOrderbyAdminMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
