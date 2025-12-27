import { Metadata } from "next";

import { getShopPolicy } from "@/actions/shop-policy-actions";

import { ShopPolicyType } from "@/types/shop-type";

export const metadata: Metadata = {
    title: "About Us",
    description: "These are the About Us",
};

const AboutUs = async ({ params }: { params: Promise<{ slug: string; domain: string }> }) => {
    const { domain } = await params;
    const data = await getShopPolicy(domain, ShopPolicyType.ABOUT_US);
    const aboutUs = data?.data?.aboutUs;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="mb-4 text-2xl font-semibold lg:mb-8 lg:text-3xl">About Us</h1>

            <div
                id="editor"
                className="whitespace-pre-wrap [&_p:empty]:mb-2 [&_p:empty]:block [&_p:empty]:h-4"
                dangerouslySetInnerHTML={{
                    __html: aboutUs || "<p>No about us available.</p>",
                }}
            />
        </div>
    );
};

export default AboutUs;
