import { getLandingPages } from "@/actions/landing-page-actions";
import { config } from "@/config";
import { LandingNotFound } from "@/features/shop/landing-page/landing-not-found";
import { LandingPageWrapper } from "@/features/shop/landing-page/landing-page-wrapper";
import { ResponseObject } from "@/types";

import { LandingPage } from "@/types/landing-type";

const REVALIDATE_TIME = 60 * 5; // 5 minutes

type Props = {
    params: Promise<{ slug: string; domain: string }>;
};

// Function to fetch all available slugs for static generation
// export async function generateStaticParams() {
//     try {
//         const response = await getLandingPages();
//         if (!response?.data) {
//             return [];
//         }
//         return response.data.map((layout: LandingPage) => ({
//             slug: layout.slug,
//         }));
//     } catch (error) {
//         console.error("Error fetching landing page layouts:", error);
//         return [];
//     }
// }

async function getShopLayoutDetails(slug: string, shopSlug: string) {
    try {
        const response = await fetch(`${config.serverUrl}/landingPageLayout/details/${slug}/${shopSlug}`, {
            // next: { revalidate: REVALIDATE_TIME },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch shop layout details");
        }

        return response.json() as Promise<ResponseObject<LandingPage>>;
    } catch (error) {
        console.error("Error fetching shop layout details:", error);
        return null;
    }
}

const Page = async ({ params }: Props) => {
    const { domain, slug } = await params;
    const shopLayoutData = await getShopLayoutDetails(slug, domain);

    if (!shopLayoutData) {
        return <LandingNotFound slug={slug} />;
    }

    return <LandingPageWrapper landingPage={shopLayoutData.data} domain={domain} />;
};

export default Page;
