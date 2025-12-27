"use client";

import { ManageBanner } from "@/features/manage-shop/website-customization/manage-banner";
import { ManageCategories } from "@/features/manage-shop/website-customization/manage-categories";
import { ManageSection } from "@/features/manage-shop/website-customization/manage-section";
import { useGetShopThemeQuery } from "@/redux/api/shop-theme-api";
import { useAppSelector } from "@/redux/store/hook";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

const WebsiteCustomization = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop?.id as string;
    const { data, isLoading, isError } = useGetShopThemeQuery({
        shopId,
    });
    const theme = data?.data;

    return (
        <div className="space-y-6">
            <HeaderBackButton title="Website Customization" href="/manage-shop" />
            <DataStateHandler
                data={theme}
                isLoading={isLoading}
                loadingClassName="py-40"
                isError={isError}
                isEmpty={!theme}
                className="space-y-6"
            >
                {(themeData) => (
                    <>
                        <ManageBanner theme={themeData} />

                        <ManageCategories theme={themeData} />

                        {themeData.shopSection.map((section) => (
                            <ManageSection
                                key={section.id}
                                section={section}
                                totalSections={themeData.shopSection.length}
                            />
                        ))}
                    </>
                )}
            </DataStateHandler>
        </div>
    );
};

export default WebsiteCustomization;
