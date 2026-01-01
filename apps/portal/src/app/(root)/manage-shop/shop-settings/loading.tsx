import { ShopBasicInfoSkeleton } from "@/features/manage-shop/shop-basic-info-skeleton";
import { ShopSettingsRightSideSkeleton } from "@/features/manage-shop/shop-settings-right-side-skeleton";

import { HeaderBackButton } from "@/components/ui/custom-back-button";

const Loading = () => {
    return (
        <>
            <HeaderBackButton title="Shop Settings" href="/manage-shop" />

            <div className="mt-4 flex gap-4 max-lg:flex-col xl:!gap-6">
                <ShopBasicInfoSkeleton className="lg:w-2/3" />
                <ShopSettingsRightSideSkeleton />
            </div>
        </>
    );
};

export default Loading;
