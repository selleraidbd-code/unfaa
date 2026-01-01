import { ShopBasicInfo } from "@/features/manage-shop/shop-basic-info";
import { ShopSettingsRightSide } from "@/features/manage-shop/shop-settings-right-side";

import { HeaderBackButton } from "@/components/ui/custom-back-button";

const page = () => {
    return (
        <>
            <HeaderBackButton title="Shop Settings" href="/manage-shop" />

            <div className="mt-4 gap-4 lg:flex xl:gap-6">
                <ShopBasicInfo className="lg:w-2/3" />
                <ShopSettingsRightSide />
            </div>
        </>
    );
};

export default page;
