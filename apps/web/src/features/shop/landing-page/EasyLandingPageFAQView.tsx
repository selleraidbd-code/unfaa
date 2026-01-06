import { ProductPageDetails } from "@/features/product/product-page-details";
import { EComponentType } from "@workspace/ui/landing/types";

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

    // Find FAQ section (first section or FAQ type)
    const faqSection =
        sections?.find((s) => s.sectionType === EComponentType.FAQ) ||
        (sections && sections.length > 0 ? sections[0] : undefined);

    // Find Contact section
    const contactSection = sections?.find((s) => s.sectionType === EComponentType.CTA);

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
                section={faqSection}
                contactSection={contactSection}
            />
        </>
    );
};
