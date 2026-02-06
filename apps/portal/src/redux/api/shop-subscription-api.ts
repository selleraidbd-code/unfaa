import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import type {
    ShopSubscription,
    ShopSubscriptionCreatePayload,
    ShopSubscriptionStatus,
} from "@/types/shop-subscription-type";

const shopSubscriptionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createShopSubscription: builder.mutation<
            ResponseObject<ShopSubscription>,
            ShopSubscriptionCreatePayload
        >({
            query: (payload) => ({
                url: `/shop-subscription`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.ShopSubscription],
        }),
        getShopSubscriptions: builder.query<PaginatedResponse<ShopSubscription>, QueryParams>({
            query: (params) => ({
                url: `/shop-subscription`,
                method: METHOD.GET,
                params,
            }),
            providesTags: [TagType.ShopSubscription],
        }),
        updateShopSubscriptionStatus: builder.mutation<
            void,
            { id: string; shopId: string; subscriptionId: string; status: ShopSubscriptionStatus }
        >({
            query: ({ id, shopId, subscriptionId, status }) => ({
                url: `/shop-subscription/${id}`,
                method: METHOD.PATCH,
                body: { shopId, subscriptionId, status },
            }),
            invalidatesTags: [TagType.ShopSubscription],
        }),
    }),
});

export const {
    useCreateShopSubscriptionMutation,
    useGetShopSubscriptionsQuery,
    useUpdateShopSubscriptionStatusMutation,
} = shopSubscriptionApi;
