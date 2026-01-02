import { ProductPageDetails } from "@/features/product/product-page-details";

import { LandingPage } from "@/types/landing-type";
import { ProductViewTracker } from "@/components/product-view-tracker";

type Props = {
    landingPage: LandingPage;
    domain: string;
};

export const EasyLandingPageFAQView = ({ landingPage, domain }: Props) => {
    const product = landingPage.product;
    const featureProducts = landingPage.featureProducts;
    const shopSlug = domain;
    const sections = landingPage.section;
    const section = sections && sections.length > 0 ? sections[0] : undefined;

    return (
        <>
            <ProductViewTracker
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                price={product.price}
                discountPrice={product.discountPrice}
                category={product.categories?.[0]?.category?.name}
                shopSlug={shopSlug}
            />
            <ProductPageDetails
                product={product}
                featureProducts={featureProducts}
                title={landingPage.name}
                shopSlug={shopSlug}
                section={section}
            />
        </>
    );
};
