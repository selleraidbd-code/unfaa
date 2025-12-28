import { getShopDetails } from "@/actions/shop-actions";
import { FeaturedProducts } from "@/features/shop/home-page/featured-products";
import { HeroSection } from "@/features/shop/home-page/hero-section";
import { HomeCategories } from "@/features/shop/home-page/home-categories";

const page = async ({ params }: { params: Promise<{ domain: string }> }) => {
    const { domain } = await params;

    const shopDetails = await getShopDetails(domain);
    const categories = shopDetails?.data?.shopTheme?.categories || [];
    const shopSections = shopDetails?.data?.shopTheme?.shopSection || [];

    return (
        <div>
            <HeroSection />
            {categories.length > 0 && (
                <HomeCategories categories={categories} shopSlug={shopDetails?.data?.slug as string} />
            )}

            {shopSections.map((section) => (
                <FeaturedProducts
                    key={section.id}
                    subtitle={section.description}
                    title={section.title}
                    uniqueId={section.id}
                    products={section.products}
                    shopSlug={shopDetails?.data?.slug as string}
                />
            ))}
        </div>
    );
};

export default page;
