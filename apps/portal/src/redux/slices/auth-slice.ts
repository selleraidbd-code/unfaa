import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/features/auth/auth-type";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuth: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.refreshToken = null;
    },
  },
});

export const { clearAuth, setToken, setUser, setAuth } = authSlice.actions;
export default authSlice.reducer;
