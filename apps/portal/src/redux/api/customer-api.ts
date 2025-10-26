import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";

import {
    CreateCustomer,
    Customer,
    FraudCheckerData,
    UpdateCustomer,
} from "@/types/customer-type";

const customerApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCustomer: builder.mutation<
            ResponseObject<Customer>,
            CreateCustomer
        >({
            query: (payload) => ({
                url: `/customer/`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Customer],
        }),
        getCustomers: builder.query<PaginatedResponse<Customer>, QueryParams>({
            query: (queryParams) => ({
                url: `/customer`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Customer],
        }),
        getCustomer: builder.query<ResponseObject<Customer>, { id: string }>({
            query: ({ id }) => ({
                url: `/customer/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Customer],
        }),
        updateCustomer: builder.mutation<void, UpdateCustomer>({
            query: ({ id, payload }) => ({
                url: `/customer/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Customer],
        }),
        deleteCustomer: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/customer/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Customer],
        }),
        getFraudCheckerData: builder.mutation<
            ResponseObject<FraudCheckerData>,
            { phoneNumber: string }
        >({
            query: ({ phoneNumber }) => ({
                url: `/customer/get-customer-fraudchecker-by-phone-number`,
                method: METHOD.POST,
                body: { phoneNumber },
            }),
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetCustomerQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useGetFraudCheckerDataMutation,
} = customerApi;
