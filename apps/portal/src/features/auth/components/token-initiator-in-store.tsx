"use client";

import React, { useEffect, useRef } from "react";

import { setState, setTokens } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";

type Props = {
    children: React.ReactNode;
    accessToken?: string;
    refreshToken?: string;
};

export const TokenInitiatorInStore = ({
    children,
    accessToken,
    refreshToken,
}: Props) => {
    const dispatch = useAppDispatch();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;

        if (accessToken && refreshToken) {
            dispatch(setTokens({ accessToken, refreshToken }));
        } else {
            dispatch(setState("success"));
        }

        hasInitialized.current = true;
    }, [accessToken, refreshToken, dispatch]);

    return <>{children}</>;
};
