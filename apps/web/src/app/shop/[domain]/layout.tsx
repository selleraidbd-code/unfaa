import { ShopProvider } from "@/contexts/shop-context";
import { getShopDetails } from "@/actions/shop-actions";
import { ShopNotFound } from "@/components/shop-not-found";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ domain: string }>;
}) => {
    const { domain } = await params;
    const shopDetails = await getShopDetails(domain);

    // If no shop is found, show the ShopNotFound component
    if (!shopDetails?.data) {
        return <ShopNotFound />;
    }

    return <ShopProvider shop={shopDetails.data}>{children}</ShopProvider>;
};

export default Layout;
