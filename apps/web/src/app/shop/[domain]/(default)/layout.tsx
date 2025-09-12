import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/navbar/Navbar";
import { getShopDetails } from "@/actions/shop-actions";
import { ShopNotFound } from "@/components/shop-not-found";
import { FloatingCall } from "@/components/shared/floating-call";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ domain: string }>;
}) => {
    const { domain } = await params;
    const shopDetails = await getShopDetails(domain);

    // If no shop is found, show the ShopNotFound component without navbar/footer
    if (!shopDetails?.data) {
        return <ShopNotFound />;
    }

    console.log("shopDetails", shopDetails);

    return (
        <>
            <Navbar shop={shopDetails.data} />
            {children}
            <FloatingCall phoneNumber={shopDetails.data.whatsappNumber} />
            <Footer shop={shopDetails.data} />
        </>
    );
};

export default Layout;
