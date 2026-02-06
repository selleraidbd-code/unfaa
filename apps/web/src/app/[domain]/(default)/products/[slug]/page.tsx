import { getProductBySlug } from "@/actions/product-actions";
import { ProductDetails } from "@/features/shop/products/product-details";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { ProductViewTracker } from "@/components/product-view-tracker";

const page = async ({ params }: { params: Promise<{ slug: string; domain: string }> }) => {
    const { slug, domain } = await params;
    const shopSlug = domain.split(".")[0] || "";

    const product = await getProductBySlug(shopSlug, slug);

    if (!product?.data) {
        return <CustomErrorOrEmpty title="Product not found" description="Please try again with different filters" />;
    }

    return (
        <>
            <ProductViewTracker
                productId={product.data.id}
                productName={product.data.name}
                productSlug={slug}
                price={product.data.price}
                discountPrice={product.data.discountPrice}
                category={product.data.categories?.[0]?.category?.name}
                shopSlug={shopSlug}
            />
            <ProductDetails product={product?.data} shopSlug={shopSlug} />
        </>
    );
};

export default page;
