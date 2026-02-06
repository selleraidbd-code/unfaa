import { Metadata } from "next";

import { getShopPolicy } from "@/actions/shop-policy-actions";

import { ShopPolicyType } from "@/types/shop-type";

export const metadata: Metadata = {
    title: "Terms and Conditions",
    description: "These are the Terms and Conditions",
};

const TermsConditions = async ({ params }: { params: Promise<{ slug: string; domain: string }> }) => {
    const { domain } = await params;
    const data = await getShopPolicy(domain, ShopPolicyType.TERMS_AND_CONDITIONS);
    const termsConditions = data?.data?.termsAndConditions;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="mb-4 text-2xl font-semibold lg:mb-8 lg:text-3xl">Terms and Conditions</h1>

            <div
                id="editor"
                className="whitespace-pre-wrap [&_p:empty]:mb-2 [&_p:empty]:block [&_p:empty]:h-4"
                dangerouslySetInnerHTML={{
                    __html: termsConditions || "<p>No terms and conditions available.</p>",
                }}
            />
        </div>
    );
};

export default TermsConditions;
