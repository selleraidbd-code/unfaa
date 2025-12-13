import * as React from "react";

import { AuthInitiatorFromCookies } from "@/features/auth/components/auth-initiator-from-cookies";
import { TokenInitiatorInStore } from "@/features/auth/components/token-initiator-in-store";
import { AlertProvider } from "@/providers/AlertProvider";
import { StoreProvider } from "@/providers/StoreProvider";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { InstallPrompt } from "@/components/shared/install-prompt";
import { OrientationLock } from "@/components/shared/orientation-lock";

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
                        <AlertProvider>
                            <OrientationLock />
                            <InstallPrompt />
                            <Toaster position="top-center" richColors />
                            {children}
                        </AlertProvider>
                    </TokenInitiatorInStore>
                </AuthInitiatorFromCookies>
            </NextThemesProvider>
        </StoreProvider>
    );
}
