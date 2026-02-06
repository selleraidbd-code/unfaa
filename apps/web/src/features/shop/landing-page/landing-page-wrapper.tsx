import { ProductViewTracker } from "@/features/product/components/product-view-tracker";
import { AdvanceLandingPageView } from "@/features/shop/landing-page/AdvanceLandingPageView";
import { EasyLandingPageFAQView } from "@/features/shop/landing-page/EasyLandingPageFAQView";
import { EPageType } from "@workspace/ui/landing/types";

import { LandingPage } from "@/types/landing-type";

type Props = {
    landingPage: LandingPage;
    domain: string;
};

export const LandingPageWrapper = ({ landingPage, domain }: Props) => {
    return (
        <>
            <ProductViewTracker
                productId={landingPage.product.id}
                productName={landingPage.product.name}
                productSlug={landingPage.product.slug}
                price={landingPage.product.price}
                discountPrice={landingPage.product.discountPrice}
                category={landingPage.product.categories?.[0]?.category?.name}
                shopSlug={domain}
            />
            {landingPage.pageType === EPageType.ADVANCED && (
                <AdvanceLandingPageView sections={landingPage.section || []} />
            )}
            {landingPage.pageType === EPageType.EASY_WITH_FAQ && (
                <EasyLandingPageFAQView landingPage={landingPage} domain={domain} />
            )}
        </>
    );
};
