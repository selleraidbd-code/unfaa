import { Metadata } from "next";

import CartWrapper from "@/features/cart/CartWrapper";

export const metadata: Metadata = {
    title: "Shopping Cart",
    description: "View and manage your shopping cart items at Hattbar",
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: "Your Shopping Cart",
        description: "Review your selected items before checkout",
        type: "website",
    },
};

const Page = () => {
    return <CartWrapper />;
};

export default Page;
