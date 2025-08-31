import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { ShopBasicInfo } from "@/features/manage-shop/shop-basic-info";
import { ShopSettingsRightSide } from "@/features/manage-shop/shop-settings-right-side";

const page = () => {
    return (
        <>
            <HeaderBackButton title="Shop Settings" href="/manage-shop" />

            <div className="flex max-lg:flex-col gap-4 xl:!gap-6 mt-4">
                <ShopBasicInfo className="w-2/3" />
                <ShopSettingsRightSide />
            </div>
        </>
    );
};

export default page;
