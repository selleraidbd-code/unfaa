import config from "@/config";
import { METHOD, RootState, tagTypes } from "@/redux/type";
import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    retry,
} from "@reduxjs/toolkit/query/react";
import { toast } from "@workspace/ui/components/sonner";

export const API_TIMEOUT = 60_000;
export const API_BASE_URL = config.serverUrl;

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,

    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;

        if (token) {
            headers.set("Authorization", `${token}`);
        }
        return headers;
    },
});

const baseQueryWithoutAuth = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,
});

export const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;

        if (refreshToken) {
            const refreshResult = await baseQueryWithoutAuth(
                {
                    url: "/auth/refresh-token",
                    method: METHOD.POST,
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const authData = refreshResult.data as { accessToken: string };
                api.dispatch({
                    type: "auth/setToken",
                    payload: authData.accessToken,
                });

                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch({ type: "auth/logout" });
                toast.error("Session expired");
            }
        } else {
            api.dispatch({ type: "auth/logout" });
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: retry(baseQueryWithReAuth, { maxRetries: 0 }),
    endpoints: () => ({}),
    tagTypes: tagTypes,
});
