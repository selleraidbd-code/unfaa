import { ShopProvider } from "@/contexts/shop-context";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <ShopProvider>{children}</ShopProvider>;
};

export default Layout;
