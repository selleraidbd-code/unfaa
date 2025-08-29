import { ShopBasicInfo } from "@/features/manage-shop/shop-basic-info";
import { ShopSettingsRightSide } from "@/features/manage-shop/shop-settings-right-side";
import { BackHeader } from "@repo/ui/components/shared/BackHeader";

const page = () => {
    return (
        <>
            <BackHeader title="Shop Settings" href="/manage-shop" />

            <div className="flex max-lg:flex-col gap-4 xl:!gap-6 mt-4">
                <ShopBasicInfo className="w-2/3" />
                <ShopSettingsRightSide />
            </div>
        </>
    );
};

export default page;
