import { api } from "@/redux/api";
import {
    METHOD,
    PaginatedResponse,
    QueryParams,
    ResponseObject,
    TagType,
} from "@/redux/type";
import {
    CourierSetup,
    CreateCourierSetup,
    RiderNote,
} from "@/types/courier-type";

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
        getSteadfastRiderNote: builder.query<
            PaginatedResponse<RiderNote>,
            QueryParams
        >({
            query: (params) => ({
                url: `/stead-fast-courier-webhook-response`,
                method: METHOD.GET,
                params,
            }),
        }),
    }),
});

export const {
    useCreateCourierSetupMutation,
    useGetCourierSetupQuery,
    useGetSteadfastRiderNoteQuery,
} = courierApi;
