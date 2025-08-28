"use client";

import { getShopDetails } from "@/actions/shop-actions";
import { Shop } from "@/types/shop-type";
import { useParams } from "next/navigation";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface ShopContextType {
    shop: Shop | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
    children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
    const { domain } = useParams();
    const domainString = domain as string;
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShop = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getShopDetails(domainString);

            if (response && response.data) {
                setShop(response.data);
            } else {
                throw new Error("Failed to fetch shop data");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch shop data"
            );
            console.error("Error fetching shop:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (domainString) {
            fetchShop();
        }
    }, [domainString]);

    const refetch = async () => {
        await fetchShop();
    };

    const value: ShopContextType = {
        shop,
        loading,
        error,
        refetch,
    };

    return (
        <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
    );
};

export const useShop = (): ShopContextType => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};

export const useShopData = (): Shop => {
    const { shop } = useShop();
    if (!shop) {
        throw new Error(
            "Shop data not available. Make sure ShopProvider is properly set up."
        );
    }
    return shop;
};
