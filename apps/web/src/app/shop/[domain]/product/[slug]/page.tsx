import { Metadata } from "next";

import { getProductBySlug, getProducts } from "@/actions/product-actions";
import { ProductPageDetails } from "@/features/product/product-page-details";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

export async function generateStaticParams() {
    const products = await getProducts({
        limit: 1000,
    });

    return (
        products?.data.map((product) => ({
            slug: product.slug,
        })) || []
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; domain: string }>;
}): Promise<Metadata> {
    const { slug, domain } = await params;
    const shopSlug = domain.split(".")[0] || "";
    const product = await getProductBySlug(shopSlug, slug);

    return {
        title: product?.data?.name || "Product not found",
        description: product?.data?.description || "Product not found",
    };
}

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
