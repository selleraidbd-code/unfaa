import { getShopDetails } from "@/actions/shop-actions";
import { FeaturedProducts } from "@/features/home-page/featured-products";
import { HeroSection } from "@/features/home-page/hero-section";
import { HomeCategories } from "@/features/home-page/home-categories";

// Configure ISR with revalidation every 30 minutes
export const revalidate = 1800; // 30 minutes in seconds

// Generate static params for all shops at build time
// export async function generateStaticParams() {
//     try {
//         const shops = await getShops();

//         if (!shops?.data) {
//             return [];
//         }

//         // Generate params for all shops using the slug property
//         return shops.data.map((shop) => ({
//             domain: shop.slug,
//         }));
//     } catch (error) {
//         console.error("Error generating static params:", error);
//         return [];
//     }
// }

const page = async ({ params }: { params: Promise<{ domain: string }> }) => {
    const { domain } = await params;

    const shopDetails = await getShopDetails(domain);
    const categories = shopDetails?.data?.shopTheme?.categories || [];
    const shopSections = shopDetails?.data?.shopTheme?.shopSection || [];

    return (
        <div>
            <HeroSection />
            <HomeCategories
                categories={categories}
                shopSlug={shopDetails?.data?.slug as string}
            />

            {/* Top Selling Products  */}

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

            {/* <FeaturedProducts
        key="top-selling-products"
        subtitle="All The Time"
        title="Top Selling Products"
        uniqueId="top-selling"
      />
      <FeaturedProducts
        key="today-selling-products"
        subtitle="Today's"
        title="Today Sell"
        uniqueId="today-selling"
      />
      <FeaturedProducts
        key="best-selling-products"
        subtitle="Today's"
        title="Today Sell"
        uniqueId="best-selling"
      />
      <FeaturedProducts
        key="featured-products-section"
        subtitle="Today's"
        title="Today Sell"
        uniqueId="featured-products"
      /> */}
        </div>
    );
};

export default page;
