import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/type";
import { CourierSetup, CreateCourierSetup } from "@/types/courier-type";

const courierApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCourierSetup: builder.mutation<void, CreateCourierSetup>({
            query: (payload) => ({
                url: `/shop-courier-setup`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Courier],
        }),
        getCourierSetup: builder.query<
            ResponseObject<CourierSetup>,
            { shopId: string }
        >({
            query: ({ shopId }) => ({
                url: `/shop-courier-setup/${shopId}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Courier],
        }),
    }),
});

export const { useCreateCourierSetupMutation, useGetCourierSetupQuery } =
    courierApi;
