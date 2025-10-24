import { authApi } from "@/redux/api/auth-api";
import {
    logoutThunk,
    setState,
    setTokens,
    setUser,
} from "@/redux/slices/auth-slice";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

export const authListener = createListenerMiddleware();

authListener.startListening({
    matcher: isAnyOf(setTokens),
    effect: async (_action, listenerApi) => {
        try {
            const user = await listenerApi
                .dispatch(
                    authApi.endpoints.getUser.initiate(undefined, {
                        forceRefetch: true,
                    })
                )
                .unwrap();

            listenerApi.dispatch(setUser(user.data));
        } catch (err) {
            listenerApi.dispatch(setState("success"));
            listenerApi.dispatch(logoutThunk());
        }
    },
});
