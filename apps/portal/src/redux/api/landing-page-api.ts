import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";

import { LandingPage, LandingPageDemo } from "@/types/landing-page-type";

const landingPageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createLandingPage: builder.mutation({
            query: (payload) => ({
                url: `/landingPageLayout`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
        createLandingPageWithSection: builder.mutation({
            query: (payload) => ({
                url: `/landingPageLayout/build-landing-layout-with-section`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
        createLandingPageDemoWithSection: builder.mutation({
            query: (payload) => ({
                url: `/landingPageLayout/build-landing-layout-demo-with-section`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
        addSectionToLandingPage: builder.mutation({
            query: (payload) => ({
                url: `/landingPageLayout/addSectionInLandingPageInBulk/${payload.page_id}`,
                method: METHOD.POST,
                body: payload.sections,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
        addFooterOrNavbarSectionToLandingPage: builder.mutation({
            query: (payload) => ({
                url: `/landingPageLayout/add-footer-or-navbar-in-landingPage/${payload.sub_domain}`,
                method: METHOD.POST,
                body: payload.sections,
            }),
        }),
        getLandingPages: builder.query<
            PaginatedResponse<LandingPage>,
            QueryParams
        >({
            query: (queryParams) => ({
                url: `/landingPageLayout`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.LandingPage],
        }),
        getLandingPage: builder.query<
            ResponseObject<LandingPage>,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `/landingPageLayout/${slug}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.LandingPage],
        }),
        getLandingPageWithProductId: builder.query<
            ResponseObject<LandingPageDemo>,
            { productId: string }
        >({
            query: ({ productId }) => ({
                url: `/landingPageLayout/${productId}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.LandingPage],
        }),
        updateLandingPage: builder.mutation<void, QueryParams>({
            query: (queryParams) => ({
                url: `/landingPageLayout/details/${queryParams.slug}`,
                method: METHOD.PATCH,
                body: queryParams.payload,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
        deleteLandingPage: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/landingPageLayout/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
    }),
});

export const {
    useCreateLandingPageMutation,
    useCreateLandingPageWithSectionMutation,
    useCreateLandingPageDemoWithSectionMutation,
    useAddSectionToLandingPageMutation,
    useAddFooterOrNavbarSectionToLandingPageMutation,
    useGetLandingPagesQuery,
    useGetLandingPageQuery,
    useUpdateLandingPageMutation,
    useDeleteLandingPageMutation,
    useGetLandingPageWithProductIdQuery,
} = landingPageApi;
