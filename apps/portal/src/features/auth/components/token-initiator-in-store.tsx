"use client";

import React, { useEffect, useRef } from "react";

import { setState, setTokens, setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { User } from "@/features/auth/auth-type";

type Props = {
    children: React.ReactNode;
    accessToken?: string;
    refreshToken?: string;
    user?: User;
};

export const TokenInitiatorInStore = ({
    children,
    accessToken,
    refreshToken,
    user,
}: Props) => {
    const dispatch = useAppDispatch();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;

        if (accessToken && refreshToken) {
            dispatch(setTokens({ accessToken, refreshToken }));
            if (user) {
                dispatch(setUser(user));
            }
        } else {
            dispatch(setState("success"));
        }

        hasInitialized.current = true;
    }, [accessToken, refreshToken, dispatch, user]);

    return <>{children}</>;
};
