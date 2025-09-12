"use client";

import { createContext, useContext } from "react";

import { User } from "@/features/auth/auth-type";
import { useGetUserQuery } from "@/redux/api/auth-api";

type UserInfoContextType = {
    user: User | undefined;
};

const UserInfoContext = createContext<UserInfoContextType | undefined>(
    undefined
);

export const UserInfoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { data } = useGetUserQuery();

    return (
        <UserInfoContext.Provider value={{ user: data?.data }}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    if (!context) {
        throw new Error("useUserInfo must be used within a UserInfoProvider");
    }
    return context;
};
