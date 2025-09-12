import { Metadata } from "next";

import { getShopPolicy } from "@/actions/shop-policy-actions";
import { ShopPolicyType } from "@/types/shop-type";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "These are the Privacy Policy",
};

const PrivacyPolicy = async ({
    params,
}: {
    params: Promise<{ slug: string; domain: string }>;
}) => {
    const { domain } = await params;
    const data = await getShopPolicy(domain, ShopPolicyType.PRIVACY_POLICY);
    const privacyPolicy = data?.data?.privacyPolicy;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="mb-4 text-2xl font-semibold lg:mb-8 lg:text-3xl">
                Privacy Policy
            </h1>

            <div
                id="editor"
                className="whitespace-pre-wrap [&_p:empty]:h-4 [&_p:empty]:block [&_p:empty]:mb-2"
                dangerouslySetInnerHTML={{
                    __html:
                        privacyPolicy || "<p>No privacy policy available.</p>",
                }}
            />
        </div>
    );
};

export default PrivacyPolicy;
