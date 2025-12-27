import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product-type";
import { getLink } from "@/lib/get-link";

interface ProductCardProps {
    product: Product;
    shopSlug: string;
}

export const ProductCard = ({ product, shopSlug }: ProductCardProps) => {
    const categories = product?.categories;

    // Calculate discount percentage
    const hasDiscount = product?.price && product?.discountPrice && product.discountPrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <Link
            href={getLink({
                shopSlug,
                path: `/products/${product.slug}`,
            })}
            className="hover:border-primary group block overflow-hidden rounded-md border border-gray-200 transition-all duration-300"
        >
            <div className="relative">
                {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10 group-hover:opacity-0">
                        <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-sm font-medium">
                            -{discountPercentage}%
                        </span>
                    </div>
                )}
                <Image
                    src={product?.photoURL || "/placeholder.jpg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="border-t p-4">
                {categories && (
                    <h3 className="bg-primary text-primary-foreground inline-block rounded-sm px-2 py-1 text-sm">
                        {categories?.map((category) => category.category.name).join(", ")}
                    </h3>
                )}
                <p className="group-hover:text-primary mt-3 line-clamp-3 text-lg transition-all duration-300 group-hover:underline">
                    {product?.banglaName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <p className="text-primary mt-1 text-xl font-semibold">${product?.discountPrice}</p>
                    <p className="text-muted-foreground mt-2 text-sm line-through">${product?.price}</p>
                </div>
            </div>
        </Link>
    );
};
