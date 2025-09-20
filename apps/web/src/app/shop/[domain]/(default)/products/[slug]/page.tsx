import { getProductBySlug } from "@/actions/product-actions";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { ProductDetails } from "@/features/products/product-details";

const page = async ({
    params,
}: {
    params: Promise<{ slug: string; domain: string }>;
}) => {
    const { slug, domain } = await params;
    const shopSlug = domain.split(".")[0] || "";

    const product = await getProductBySlug(shopSlug, slug);

    if (!product?.data) {
        return (
            <CustomErrorOrEmpty
                title="Product not found"
                description="Please try again with different filters"
            />
        );
    }

    return <ProductDetails product={product?.data} />;
};

export default page;
