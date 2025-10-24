import React from "react";
import { cookies } from "next/headers";

import { TokenInitiatorInStore } from "@/features/auth/components/token-initiator-in-store";

type Props = {
    children: React.ReactNode;
};

export const AuthInitiatorFromCookies = async ({ children }: Props) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    return (
        <TokenInitiatorInStore
            accessToken={accessToken}
            refreshToken={refreshToken}
        >
            {children}
        </TokenInitiatorInStore>
    );
};
