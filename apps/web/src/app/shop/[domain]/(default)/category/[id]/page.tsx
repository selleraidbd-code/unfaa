import { getProducts } from "@/actions/product-actions";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { ProductCard } from "@/features/home-page/product-card";
import { getLink } from "@/lib/get-link";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb";
import { Home } from "lucide-react";

const page = async ({
    params,
}: {
    params: Promise<{ id: string; domain: string }>;
}) => {
    const { id, domain } = await params;
    const data = await getProducts({ categoryId: id });
    const products = data?.data;
    const category = products?.[0]?.categories?.[0]?.category?.name;

    return (
        <div className="container pt-6 pb-12 space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href={getLink({ shopSlug: domain, path: "/" })}
                            className="flex items-center gap-2"
                        >
                            <Home className="size-4" /> Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {category && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{category}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            {products?.length && products?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products?.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            shopSlug={domain}
                        />
                    ))}
                </div>
            ) : (
                <CustomErrorOrEmpty
                    className="h-[60vh]"
                    title="No products found"
                    description="There are no products in this category."
                />
            )}
        </div>
    );
};

export default page;
