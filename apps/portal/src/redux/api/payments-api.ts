import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";
import { Payment } from "@/types/payments-type";

const paymentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query<PaginatedResponse<Payment>, QueryParams>({
            query: (queryParams) => ({
                url: `/subscription`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Payment],
        }),
        getPayment: builder.query<ResponseObject<Payment>, { id: string }>({
            query: ({ id }) => ({
                url: `/subscription/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Payment],
        }),
        createPayment: builder.mutation<Payment, Omit<Payment, "id">>({
            query: (payload) => ({
                url: `/subscription`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Payment],
        }),
        updatePayment: builder.mutation<
            Payment,
            { id: string; payload: Partial<Payment> }
        >({
            query: ({ id, payload }) => ({
                url: `/subscription/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Payment],
        }),
        deletePayment: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/subscription/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Payment],
        }),
    }),
});

export const {
    useGetPaymentsQuery,
    useGetPaymentQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentsApi;
