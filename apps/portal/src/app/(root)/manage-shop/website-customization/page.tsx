"use client";

import { EmptyErrorLoadingHandler } from "@/components/shared/empty-error-loading-handler";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { ManageBanner } from "@/features/manage-shop/website-customization/manage-banner";
import { ManageCategories } from "@/features/manage-shop/website-customization/manage-categories";
import { ManageSection } from "@/features/manage-shop/website-customization/manage-section";
import useGetUser from "@/hooks/useGetUser";
import { useGetShopThemeQuery } from "@/redux/api/shop-theme-api";

const WebsiteCustomization = () => {
    const user = useGetUser();
    const shopId = user?.shop?.id as string;
    const { data, isLoading, isError } = useGetShopThemeQuery({
        shopId,
    });
    const theme = data?.data;

    return (
        <div className="space-y-6">
            <HeaderBackButton
                title="Website Customization"
                href="/manage-shop"
            />
            <EmptyErrorLoadingHandler
                isLoading={isLoading}
                loadingClassName="py-40"
                isError={isError}
                isEmpty={!theme}
                className="space-y-6"
            >
                {theme && (
                    <>
                        <ManageBanner theme={theme} />

                        <ManageCategories theme={theme} />

                        {theme.shopSection.map((section) => (
                            <ManageSection key={section.id} section={section} />
                        ))}
                    </>
                )}
            </EmptyErrorLoadingHandler>
        </div>
    );
};

export default WebsiteCustomization;
