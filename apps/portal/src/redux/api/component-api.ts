import { api } from "@/redux/api";
import { METHOD, TagType } from "@/redux/type";
import { PaginatedResponse, QueryParams, ResponseObject } from "@/redux/type";
import { Component } from "@workspace/ui/landing/types";

const componentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getComponents: builder.query<PaginatedResponse<Component>, QueryParams>(
            {
                query: (query) => ({
                    url: `/component`,
                    method: METHOD.GET,
                    params: query,
                }),
                providesTags: [TagType.Component],
            }
        ),
        getComponent: builder.query<ResponseObject<Component>, string>({
            query: (id) => ({
                url: `/component/${id}`,
                method: METHOD.GET,
            }),
        }),
        createComponent: builder.mutation({
            query: (payload) => ({
                url: `/component/`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Component],
        }),
        deleteComponent: builder.mutation<void, string>({
            query: (id) => ({
                url: `/component/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Component],
        }),
    }),
});

export const {
    useGetComponentsQuery,
    useCreateComponentMutation,
    useDeleteComponentMutation,
    useGetComponentQuery,
} = componentApi;
