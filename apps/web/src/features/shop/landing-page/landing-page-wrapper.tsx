import { ProductViewTracker } from "@/features/product/components/product-view-tracker";
import { AdvanceLandingPageView } from "@/features/shop/landing-page/AdvanceLandingPageView";
import { LandingPage01 } from "@/features/shop/landing-page/landing-page-1";
import { LandingPage02 } from "@/features/shop/landing-page/landing-page-2";
import { LandingPage03 } from "@/features/shop/landing-page/landing-page-3";
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
            {landingPage.pageType === EPageType.ADVANCED_LANDING_PAGE_1 && (
                <AdvanceLandingPageView sections={landingPage.section || []} />
            )}
            {landingPage.pageType === EPageType.EASY_LANDING_PAGE_1 && (
                <LandingPage01 landingPage={landingPage} domain={domain} />
            )}
            {landingPage.pageType === EPageType.EASY_LANDING_PAGE_2 && (
                <LandingPage02 landingPage={landingPage} domain={domain} />
            )}
            {landingPage.pageType === EPageType.EASY_LANDING_PAGE_3 && (
                <LandingPage03 landingPage={landingPage} domain={domain} />
            )}
        </>
    );
};
