"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StoreProvider } from "@/providers/StoreProvider";
import { Toaster } from "sonner";
import { AlertProvider } from "@/providers/AlertProvider";

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
                <AlertProvider>
                    <Toaster position="top-center" richColors />
                    {children}
                </AlertProvider>
            </NextThemesProvider>
        </StoreProvider>
    );
}
