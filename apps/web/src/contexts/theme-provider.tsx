"use client";

import { useEffect } from "react";

const normalizeColor = (color: string): string | null => {
    if (!color) return null;

    const cleanColor = color.trim();

    const div = document.createElement("div");
    div.style.color = cleanColor;
    const isValidColor = div.style.color !== "";

    if (isValidColor) {
        return cleanColor;
    }

    if (/^[0-9A-Fa-f]{6}$/.test(cleanColor)) {
        return `#${cleanColor}`;
    }

    if (/^#[0-9A-Fa-f]{6}$/.test(cleanColor)) {
        return cleanColor;
    }

    return null;
};

// Helper function to generate a contrasting foreground color
const getContrastingForeground = (backgroundColor: string): string => {
    // Simple contrast calculation - you might want to use a more sophisticated library
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
};

export const ThemeProvider = ({
    children,
    themeColor,
}: {
    children: React.ReactNode;
    themeColor?: string;
}) => {
    useEffect(() => {
        const root = document.documentElement;

        if (themeColor) {
            const primaryColor = normalizeColor(themeColor);

            if (primaryColor) {
                root.style.setProperty("--primary", primaryColor);

                const foregroundColor = getContrastingForeground(primaryColor);
                root.style.setProperty("--primary-foreground", foregroundColor);

                // Set related colors
                root.style.setProperty("--ring", primaryColor);
            }
        } else {
            // Reset to default theme if no custom theme
            root.style.removeProperty("--primary");
            root.style.removeProperty("--primary-foreground");
            root.style.removeProperty("--ring");
        }
    }, [themeColor]);

    return <>{children}</>;
};
