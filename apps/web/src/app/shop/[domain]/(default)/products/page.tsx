import { getBrands } from "@/actions/brand-actions";
import { getCategories } from "@/actions/category-actions";
import { getProducts } from "@/actions/product-actions";
import { getShopDetails } from "@/actions/shop-actions";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { ProductCard } from "@/features/home-page/product-card";
import { ProductsPageWrapper } from "@/features/products/products-page-wrapper";

const page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ domain: string }>;
    searchParams: Promise<{ minPrice: string; maxPrice: string }>;
}) => {
    const { domain } = await params;
    const shopDetails = await getShopDetails(domain);
    const { minPrice, maxPrice } = await searchParams;

    const [categories, brands] = await Promise.all([
        getCategories({ shopId: shopDetails?.data?.id }),
        getBrands({ shopId: shopDetails?.data?.id }),
    ]);

    const productsData = await getProducts({
        shopId: shopDetails?.data?.id,
        minPrice,
        maxPrice,
    });

    const products = productsData?.data || [];

    return (
        <ProductsPageWrapper
            totalProducts={products?.length || 0}
            categories={categories?.data || []}
            brands={brands?.data || []}
            minPrice={minPrice ? parseInt(minPrice) : 0}
            maxPrice={maxPrice ? parseInt(maxPrice) : 1000}
        >
            {products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            ) : (
                <CustomErrorOrEmpty
                    className="h-[50vh]"
                    title="No products found"
                    description="Please try again with different filters"
                />
            )}
        </ProductsPageWrapper>
    );
};

export default page;
