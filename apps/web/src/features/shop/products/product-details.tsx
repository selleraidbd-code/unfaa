import { ProductDetailsActionButtons } from "@/features/shop/products/product-details-action-buttons";
import { ProductDetailsImages } from "@/features/shop/products/product-details-images";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { HomeIcon } from "lucide-react";

import { Product } from "@/types/product-type";
import { getLink } from "@/lib/get-link";
import { HtmlRenderer } from "@/components/shared/html-renderer";

export const ProductDetails = ({ product, shopSlug }: { product: Product; shopSlug: string }) => {
    return (
        <section className="container pb-12">
            <Breadcrumb className="my-5">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href={getLink({
                                shopSlug,
                                path: "/",
                            })}
                            className="flex items-center gap-1"
                        >
                            <HomeIcon className="h-4 w-4" />
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{product?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                <ProductDetailsImages images={product?.images} photoURL={product?.photoURL} />

                {/* Product Details */}
                <div>
                    <h1 className="text-xl font-medium lg:text-[26px] lg:leading-[38px]">{product?.name}</h1>

                    <div className="mt-2.5 mb-5 space-y-1">
                        <p className="flex items-center gap-2">
                            <span className="text-foreground font-semibold">Category:</span> {product?.slug}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-foreground font-semibold">Warranty:</span> {product?.warranty}
                        </p>
                    </div>

                    <div className="mb-5 flex items-baseline gap-4">
                        <span className="text-primary text-4xl font-semibold">
                            ৳<span className="pl-0.5">{product?.discountPrice}</span>
                        </span>
                        <span className="text-muted-foreground text-2xl line-through">
                            {" "}
                            ৳<span className="pl-0.5">{product?.price}</span>
                        </span>
                    </div>

                    <div className="mb-2 flex gap-5 text-base">
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Total:</span> {product?.stock}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Sold:</span> 5
                        </p>
                    </div>

                    {product?.stock > 0 && <p className="mb-2 text-sm font-medium text-green-500">In Stock</p>}

                    <HtmlRenderer html={product?.description} />

                    <Separator className="my-4" />

                    <ProductDetailsActionButtons product={product} shopSlug={shopSlug} />
                </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
                <h2 className="text-lg font-medium">Description</h2>
                <HtmlRenderer html={product?.fullDescription} />
            </div>
        </section>
    );
};
