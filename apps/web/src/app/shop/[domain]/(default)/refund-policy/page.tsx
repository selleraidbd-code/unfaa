import { Metadata } from "next";

import { getShopPolicy } from "@/actions/shop-policy-actions";
import { ShopPolicyType } from "@/types/shop-type";

export const metadata: Metadata = {
    title: "Refund Policy",
    description: "These are the Refund Policy",
};

const RefundPolicy = async ({
    params,
}: {
    params: Promise<{ slug: string; domain: string }>;
}) => {
    const { domain } = await params;
    const data = await getShopPolicy(domain, ShopPolicyType.REFUND_POLICY);
    const refundPolicy = data?.data?.refundPolicy;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="mb-4 text-2xl font-semibold lg:mb-8 lg:text-3xl">
                Refund Policy
            </h1>

            <div
                id="editor"
                className="whitespace-pre-wrap [&_p:empty]:h-4 [&_p:empty]:block [&_p:empty]:mb-2"
                dangerouslySetInnerHTML={{
                    __html:
                        refundPolicy || "<p>No refund policy available.</p>",
                }}
            />
        </div>
    );
};

export default RefundPolicy;
