"use client";

import React, { useEffect, useState } from "react";

import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const ClientPersistGate = ({ children }: { children: React.ReactNode }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <>{children}</>;
    }

    return <PersistGate persistor={persistor}>{children}</PersistGate>;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <ClientPersistGate>{children}</ClientPersistGate>
        </Provider>
    );
};
