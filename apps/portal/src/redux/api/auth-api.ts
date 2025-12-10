import { AuthResponse, User } from "@/features/auth/auth-type";
import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<
            ResponseObject<{
                user: User;
                accessToken: string;
                refreshToken: string;
            }>,
            { name: string; email: string; password: string }
        >({
            query: (payload) => ({
                url: `/auth/signup`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        verifySignupOTP: builder.mutation<{ user: User; accessToken: string }, { token: number }>({
            query: (payload) => ({
                url: `/auth/verify-signup-token`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        reSendVerificationSignupOTP: builder.mutation<void, { email: string }>({
            query: (payload) => ({
                url: `/auth/resend-signup-email/${payload.email}`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        signIn: builder.mutation<ResponseObject<AuthResponse>, { email: string; password: string }>({
            query: (payload) => ({
                url: `/auth/signin`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        getUser: builder.query<ResponseObject<User>, void>({
            query: () => ({
                url: `/user/me`,
                method: METHOD.GET,
            }),
        }),
        getUsers: builder.query<PaginatedResponse<User>, QueryParams>({
            query: (payload) => ({
                url: `/user/`,
                method: METHOD.GET,
                params: payload,
            }),
            providesTags: [TagType.User],
        }),
        sendForgotPasswordEmail: builder.mutation<void, { email: string }>({
            query: (payload) => ({
                url: `/auth/send-forgot-email/${payload.email}`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        verifyForgotPasswordOTP: builder.mutation<void, { email: string; otp: number }>({
            query: (payload) => ({
                url: `/auth/verify-forgot-token`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        resetPassword: builder.mutation<
            ResponseObject<AuthResponse>,
            { token: number; email: string; password: string }
        >({
            query: (payload) => ({
                url: `/auth/change-password`,
                method: METHOD.POST,
                body: payload,
            }),
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.User],
        }),
    }),
});

export const {
    useSignUpMutation,
    useVerifySignupOTPMutation,
    useReSendVerificationSignupOTPMutation,
    useSignInMutation,
    useGetUserQuery,
    useGetUsersQuery,
    useDeleteUserMutation,
    useSendForgotPasswordEmailMutation,
    useVerifyForgotPasswordOTPMutation,
    useResetPasswordMutation,
} = authApi;
