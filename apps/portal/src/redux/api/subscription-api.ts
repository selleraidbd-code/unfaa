import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import type {
    CreateSubscriptionPlanPayload,
    SubscriptionPlan,
    UpdateSubscriptionPlanPayload,
} from "@/types/subscription-plan-type";

const subscriptionPlanApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionPlans: builder.query<PaginatedResponse<SubscriptionPlan>, QueryParams | void>({
            query: (params = {}) => ({
                url: "/subscription",
                method: METHOD.GET,
                params: params || undefined,
            }),
            providesTags: [TagType.SubscriptionPlan],
        }),
        getSubscriptionPlan: builder.query<ResponseObject<SubscriptionPlan>, string>({
            query: (id) => ({
                url: `/subscription/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.SubscriptionPlan],
        }),
        createSubscriptionPlan: builder.mutation<ResponseObject<SubscriptionPlan>, CreateSubscriptionPlanPayload>({
            query: (payload) => ({
                url: "/subscription",
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.SubscriptionPlan],
        }),
        updateSubscriptionPlan: builder.mutation<
            ResponseObject<SubscriptionPlan>,
            { id: string; payload: UpdateSubscriptionPlanPayload }
        >({
            query: ({ id, payload }) => ({
                url: `/subscription/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.SubscriptionPlan],
        }),
        deleteSubscriptionPlan: builder.mutation<void, string>({
            query: (id) => ({
                url: `/subscription/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.SubscriptionPlan],
        }),
    }),
});

export const {
    useGetSubscriptionPlansQuery,
    useGetSubscriptionPlanQuery,
    useCreateSubscriptionPlanMutation,
    useUpdateSubscriptionPlanMutation,
    useDeleteSubscriptionPlanMutation,
} = subscriptionPlanApi;
