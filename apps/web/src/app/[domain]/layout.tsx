import type { Metadata } from "next";

import { getShopDetails, getShops } from "@/actions/shop-actions";
import { ShopProvider } from "@/contexts/shop-context";

import { ShopNotFound } from "@/components/shop-not-found";
import { TrackingPixels } from "@/components/tracking-pixels";

// Enable ISR with revalidation time (300 seconds = 5 minutes)
// Next.js requires a literal number, not a variable
export const revalidate = 300;

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
    // React cache() ensures this call is deduplicated with the one in Layout component
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
    // React cache() ensures this is deduplicated with generateMetadata call
    const shopDetails = await getShopDetails(domain);

    // If no shop is found, show the ShopNotFound component
    if (!shopDetails?.data) {
        return <ShopNotFound />;
    }

    const shop = shopDetails.data;

    return (
        <>
            <TrackingPixels facebookPixelId={shop.facebookPixelId} tiktokPixelId={shop.tiktokPixelId} />
            <ShopProvider shop={shop}>{children}</ShopProvider>
        </>
    );
};

export default Layout;
