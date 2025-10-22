import { Footer } from "@/components/shop/Footer";
import { Navbar } from "@/components/shop/navbar/Navbar";
import { getShopDetails } from "@/actions/shop-actions";
import { ShopNotFound } from "@/components/shop-not-found";
import { FloatingCall } from "@/components/shop/floating-call";

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

    const whatsappNumber = shopDetails.data.whatsappNumber;

    return (
        <>
            <Navbar shop={shopDetails.data} />
            {children}
            {whatsappNumber && <FloatingCall phoneNumber={whatsappNumber} />}
            <Footer shop={shopDetails.data} />
        </>
    );
};

export default Layout;
