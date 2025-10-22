import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/features/landing/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
