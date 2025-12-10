import { api } from "@/redux/api";
import authReducer from "@/redux/slices/auth-slice";
import componentsReducer from "@/redux/slices/components-slice";
import landingPageReducer from "@/redux/slices/landing-page-slice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { storage } from "./storage";

const persistConfig = {
    auth: {
        key: "auth",
        storage: storage,
        whitelist: ["accessToken", "refreshToken"],
    },
    components: {
        key: "components",
        storage: storage,
        whitelist: ["components"],
    },
};

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: persistReducer(persistConfig.auth, authReducer),
    landingPage: landingPageReducer,
    components: persistReducer(persistConfig.components, componentsReducer),
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: false,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(api.middleware),
});

export const persistor = persistStore(store);
