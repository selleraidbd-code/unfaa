import { getProductBySlug } from "@/actions/product-actions";
import { ProductPageDetails } from "@/features/product/product-page-details";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

const page = async ({ params }: { params: Promise<{ slug: string; domain: string }> }) => {
    const { slug, domain } = await params;
    const shopSlug = domain.split(".")[0] || "";

    const product = await getProductBySlug(shopSlug, slug);

    if (!product?.data) {
        return <CustomErrorOrEmpty title="Product not found" description="Please try again with different filters" />;
    }

    return <ProductPageDetails product={product?.data} shopSlug={shopSlug} />;
};

export default page;
