import { logoutAction, revalidateTokensAction } from "@/actions/auth-actions";
import { User } from "@/features/auth/auth-type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    user: User | null;

    state: "loading" | "success"; // TODO: Rethink about this

    accessToken: string | null;
    refreshToken: string | null;
};

// Async thunk for logout
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
    await logoutAction();
    window.location.reload();
});

// Set token to server side storage
export const setTokensThunk = createAsyncThunk(
    "auth/setTokens",
    async (tokens: { accessToken: string; refreshToken: string }) => {
        await revalidateTokensAction(tokens.accessToken, tokens.refreshToken);
    }
);

const initialState: AuthState = {
    user: null,

    state: "loading",

    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.state = "success";
            state.user = action.payload;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        setTokens: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setState: (state, action: PayloadAction<"loading" | "success">) => {
            state.state = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        });
    },
});

export const { setUser, clearAuth, setTokens, setState } = authSlice.actions;

export default authSlice.reducer;
