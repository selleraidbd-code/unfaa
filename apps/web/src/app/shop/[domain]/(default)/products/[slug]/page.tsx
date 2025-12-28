import { getProductBySlug } from "@/actions/product-actions";
import { ProductDetails } from "@/features/shop/products/product-details";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { PageViewTracker } from "@/components/page-view-tracker";

const page = async ({ params }: { params: Promise<{ slug: string; domain: string }> }) => {
    const { slug, domain } = await params;
    const shopSlug = domain.split(".")[0] || "";

    const product = await getProductBySlug(shopSlug, slug);

    if (!product?.data) {
        return <CustomErrorOrEmpty title="Product not found" description="Please try again with different filters" />;
    }

    return (
        <>
            <PageViewTracker
                pageName="Product Details"
                pageData={{
                    productId: product.data.id,
                    productName: product.data.name,
                    productSlug: slug,
                    shopSlug,
                    price: product.data.price,
                    categories: product.data.categories?.map((c) => c.category.name).join(", "),
                }}
            />
            <ProductDetails product={product?.data} shopSlug={shopSlug} />
        </>
    );
};

export default page;
