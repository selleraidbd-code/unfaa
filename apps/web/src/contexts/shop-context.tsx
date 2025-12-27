"use client";

import { createContext, ReactNode, useContext } from "react";

import { ThemeProvider } from "@/contexts/theme-provider";

import { Shop, ShopTheme } from "@/types/shop-type";

interface ShopContextType {
    shop: Shop;
    shopTheme: ShopTheme | null;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
    children: ReactNode;
    shop: Shop;
}

export const ShopProvider = ({ children, shop }: ShopProviderProps) => {
    const value: ShopContextType = {
        shop,
        shopTheme: shop?.shopTheme,
    };

    return (
        <ShopContext.Provider value={value}>
            <ThemeProvider themeColor={shop.theme}>{children}</ThemeProvider>
        </ShopContext.Provider>
    );
};

export const useShop = (): ShopContextType => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};
