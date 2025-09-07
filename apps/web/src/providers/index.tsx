"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@workspace/ui/components/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <Toaster position="top-center" richColors />
            {children}
        </NextThemesProvider>
    );
}
