import { getLink } from "@/lib/get-link";
import { ProductDetailsActionButtons } from "@/features/products/product-details-action-buttons";
import { ProductDetailsImages } from "@/features/products/product-details-images";
import { ProductDetailsSidebar } from "@/features/products/product-details-sidebar";
import { Product } from "@/types/product-type";
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

export const ProductDetails = ({
    product,
    shopSlug,
}: {
    product: Product;
    shopSlug: string;
}) => {
    return (
        <section className="container pb-12">
            <Breadcrumb className="my-6">
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

            <div className="grid lg:grid-cols-12">
                <div className="grid gap-8 col-span-9 pr-10 lg:grid-cols-2">
                    <ProductDetailsImages
                        images={product?.images}
                        photoURL={product?.photoURL}
                    />

                    {/* Product Details */}
                    <div>
                        <h1 className="text-xl font-medium lg:text-[26px] lg:leading-[38px]">
                            {product?.name}
                        </h1>

                        <div className="mt-2.5 mb-5 space-y-1">
                            <p className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                    Category:
                                </span>{" "}
                                {product?.slug}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                    Warranty:
                                </span>{" "}
                                {product?.warranty}
                            </p>
                        </div>

                        <div className="flex mb-5 items-baseline gap-4">
                            <span className="text-4xl font-semibold text-primary">
                                ৳
                                <span className="pl-0.5">
                                    {product?.discountPrice}
                                </span>
                            </span>
                            <span className="text-2xl text-muted-foreground line-through">
                                {" "}
                                ৳
                                <span className="pl-0.5">{product?.price}</span>
                            </span>
                        </div>

                        <div className="flex gap-5 text-base mb-2">
                            <p className="flex items-center gap-2">
                                <span className="font-semibold">Total:</span>{" "}
                                {product?.stock}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="font-semibold">Sold:</span> 5
                            </p>
                        </div>

                        {product?.stock > 0 && (
                            <p className="text-sm font-medium text-green-500 mb-2">
                                In Stock
                            </p>
                        )}

                        <p className="text-base">{product?.description}</p>

                        <Separator className="my-4" />

                        <ProductDetailsActionButtons product={product} />
                    </div>
                </div>

                <ProductDetailsSidebar product={product} />
            </div>
        </section>
    );
};
