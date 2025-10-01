import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Secure Checkout",
    description: "Complete your purchase securely at Ecory",
    robots: {
        index: false,
        follow: false,
    },

    openGraph: {
        title: "Secure Checkout",
        description: "Complete your purchase securely",
        type: "website",
    },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <div className="bg-gray-0 min-h-screen">{children}</div>;
};

export default Layout;
