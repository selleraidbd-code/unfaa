import { getShopDetails } from "@/actions/shop-actions";

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
    const shopTheme = shopDetails?.data?.shopTheme;

    console.log("shopTheme", shopTheme);

    return (
        <div>
            {/* <HeroSection bannerImg={shopTheme?.bannerImg} /> */}

            {/* Top Selling Products  */}
            {/* <FeaturedProducts
                subtitle="All The Time"
                title="Top Selling Products"
            />
            <FeaturedProducts subtitle="Today's" title="Today Sell" />
            <FeaturedProducts subtitle="Today's" title="Today Sell" />
            <FeaturedProducts subtitle="Today's" title="Today Sell" />
            <FeaturedProducts subtitle="Today's" title="Today Sell" />
            <FeaturedProducts subtitle="Today's" title="Hot Deal Products" /> */}
        </div>
    );
};

export default page;
