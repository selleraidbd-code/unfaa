import AboutUs from "@/features/manage-shop/AboutUs";
import PrivecyPolicy from "@/features/manage-shop/PrivacyPolicy";
import ReturnAndCancellationPolicy from "@/features/manage-shop/ReturnAndCancellationPolicy";
import TermsandConditions from "@/features/manage-shop/TermsandConditions";
import { ArrowBackButton } from "@/components/ui/custom-back-button";

const ShopPolicy = () => {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3 py-6">
                <ArrowBackButton
                    href="/manage-shop"
                    className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                />
                <h1 className="text-xl font-semibold">Shop Policy</h1>
            </div>
            <AboutUs />
            <PrivecyPolicy />
            <TermsandConditions />
            <ReturnAndCancellationPolicy />
        </div>
    );
};

export default ShopPolicy;
