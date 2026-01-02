import { config } from "@/config";
import { AdvanceLandingPageView } from "@/features/shop/landing-page/AdvanceLandingPageView";
import { EasyLandingPageFAQView } from "@/features/shop/landing-page/EasyLandingPageFAQView";
import { LandingNotFound } from "@/features/shop/landing-page/landing-not-found";
import { ResponseObject } from "@/types";
import { EPageType } from "@workspace/ui/landing/types";

import { LandingPage } from "@/types/landing-type";

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

async function getShopLayoutDetails(slug: string) {
    try {
        const response = await fetch(`${config.serverUrl}/landingPageLayout/details/${slug}`, {
            cache: "force-cache",
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

const PreviewPage = async ({ params }: Props) => {
    const { slug, domain } = await params;
    const shopLayoutData = await getShopLayoutDetails(slug);
    console.log("shopLayoutData", shopLayoutData);

    if (!shopLayoutData) {
        return <LandingNotFound slug={slug} />;
    }

    if (shopLayoutData.data.pageType === EPageType.ADVANCED) {
        return <AdvanceLandingPageView sections={shopLayoutData.data.section || []} />;
    }

    if (shopLayoutData.data.pageType === EPageType.EASY_WITH_FAQ) {
        return <EasyLandingPageFAQView landingPage={shopLayoutData.data} domain={domain} />;
    }

    return <LandingNotFound slug={slug} />;
};

export default PreviewPage;
