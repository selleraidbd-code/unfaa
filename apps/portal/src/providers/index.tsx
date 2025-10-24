import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StoreProvider } from "@/providers/StoreProvider";
import { Toaster } from "@workspace/ui/components/sonner";
import { AlertProvider } from "@/providers/AlertProvider";
import { UserInfoProvider } from "@/providers/user-info-provider";
import { AuthInitiatorFromCookies } from "@/features/auth/components/auth-initiator-from-cookies";
import { TokenInitiatorInStore } from "@/features/auth/components/token-initiator-in-store";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StoreProvider>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                enableColorScheme
            >
                <AuthInitiatorFromCookies>
                    <TokenInitiatorInStore>
                        <UserInfoProvider>
                            <AlertProvider>
                                <Toaster position="top-center" richColors />
                                {children}
                            </AlertProvider>
                        </UserInfoProvider>
                    </TokenInitiatorInStore>
                </AuthInitiatorFromCookies>
            </NextThemesProvider>
        </StoreProvider>
    );
}
