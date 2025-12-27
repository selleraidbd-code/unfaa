import type { Metadata } from "next";

import { getShopDetails, getShops } from "@/actions/shop-actions";
import { ShopProvider } from "@/contexts/shop-context";

import { ShopNotFound } from "@/components/shop-not-found";

// Generate static params for all shops at build time
export async function generateStaticParams() {
    const shops = await getShops();

    if (!shops?.data) {
        return [];
    }

    return shops.data.map((shop) => ({
        domain: shop.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
    const { domain } = await params;
    const shopDetails = await getShopDetails(domain);

    if (!shopDetails?.data) {
        return {
            title: "Shop Not Found",
        };
    }

    const shop = shopDetails.data;

    return {
        title: shop.name,
        description: shop.description,
        icons: {
            icon: shop.photoURL,
            shortcut: shop.photoURL,
            apple: shop.photoURL,
        },
    };
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ domain: string }> }) => {
    const { domain } = await params;
    const shopDetails = await getShopDetails(domain);

    // If no shop is found, show the ShopNotFound component
    if (!shopDetails?.data) {
        return <ShopNotFound />;
    }

    return <ShopProvider shop={shopDetails.data}>{children}</ShopProvider>;
};

export default Layout;
