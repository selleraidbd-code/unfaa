import { getProductBySlug } from "@/actions/product-actions";
import { ProductDetailPage } from "@/features/products/ProductDetailPage";

const page = async ({
    params,
}: {
    params: Promise<{ slug: string; domain: string }>;
}) => {
    const { slug, domain } = await params;
    const shopSlug = domain.split(".")[0] || "";
    const product = await getProductBySlug(shopSlug, slug);
    return (
        <div>
            <ProductDetailPage product={product?.data} />
        </div>
    );
};

export default page;
