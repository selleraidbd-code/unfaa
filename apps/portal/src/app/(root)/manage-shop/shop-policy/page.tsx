// import PrivecyPolicy from "@/features/manage-shop/PrivacyPolicy";
// import ReturnAndCancellationPolicy from "@/features/manage-shop/ReturnAndCancellationPolicy";
// import TermsandConditions from "@/features/manage-shop/TermsandConditions";
// import { ArrowBackButton } from "@/components/ui/custom-back-button";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";

const ShopPolicy = () => {
    return (
        <div className="space-y-6">
            <HeaderBackButton title="Shop Policy" href="/manage-shop" />

            <CustomCollapsible title="Shop Basic Info" content={<></>} />
            {/* <div className="flex items-center gap-3 py-6">
                <ArrowBackButton
                    href="/manage-shop"
                    className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                />
                <h1 className="text-xl font-semibold">Shop Policy</h1>
            </div>
            <AboutUs />
            <PrivecyPolicy />
            <TermsandConditions />
            <ReturnAndCancellationPolicy /> */}
        </div>
    );
};

export default ShopPolicy;
