import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";

import { LandingPageDemo } from "@/types/landing-page-type";

const landingPageTemplateApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createLandingPageTemplate: builder.mutation({
            query: (payload) => ({
                url: `/landingPageLayoutDemo`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),

        getLandingPagesTemplate: builder.query<
            PaginatedResponse<LandingPageDemo>,
            QueryParams
        >({
            query: (queryParams) => ({
                url: `/landingPageLayoutDemo`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.LandingPage],
        }),
        getLandingPageTemplate: builder.query<
            ResponseObject<LandingPageDemo>,
            { sub_domain: string }
        >({
            query: ({ sub_domain }) => ({
                url: `/landingPageLayoutDemo/${sub_domain}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.LandingPage],
        }),
        updateLandingPageTemplate: builder.mutation<void, QueryParams>({
            query: (queryParams) => ({
                url: `/landingPageLayoutDemo/details/${queryParams.slug}`,
                method: METHOD.PATCH,
                body: queryParams.payload,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
        deleteLandingPageTemplate: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/landingPageLayoutDemo/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.LandingPage],
        }),
    }),
});

export const {
    useCreateLandingPageTemplateMutation,
    useGetLandingPagesTemplateQuery,
    useGetLandingPageTemplateQuery,
    useUpdateLandingPageTemplateMutation,
    useDeleteLandingPageTemplateMutation,
} = landingPageTemplateApi;
