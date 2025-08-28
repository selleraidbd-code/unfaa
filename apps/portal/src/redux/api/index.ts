import config from "@/config";
import { clearAuth } from "@/redux/slices/auth-slice";
import { RootState, tagTypes } from "@/redux/type";
import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    retry,
} from "@reduxjs/toolkit/query/react";

export const API_TIMEOUT = 60_000;

export const baseQuery = fetchBaseQuery({
    baseUrl: config.serverUrl,
    timeout: API_TIMEOUT,

    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;

        if (token) {
            headers.set("Authorization", `${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (
        result.error &&
        (result.error.status === 401 ||
            // result.error.status === 403 ||
            result.error.status === 500)
    ) {
        api.dispatch(clearAuth());
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: retry(baseQueryWithReAuth, { maxRetries: 0 }),
    endpoints: () => ({}),
    tagTypes: tagTypes,
});
