import { Product } from "@/types/product-type";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="rounded-md  block border border-gray-200 overflow-hidden transition-all duration-300 hover:border-primary group"
        >
            <div className="relative ">
                <div className="absolute top-3 left-3 z-10 group-hover:opacity-0">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-2 py-1 rounded">
                        -17%
                    </span>
                </div>
                <Image
                    src={product?.photoURL || "/placeholder.jpg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full relative h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="p-4 border-t ">
                <h3 className="text-sm  bg-primary text-primary-foreground px-2 py-1 rounded-sm inline-block">
                    {product?.categories
                        ?.map((category) => category.category.name)
                        .join(", ")}
                </h3>
                <p className="text-lg mt-3  transition-all duration-300 group-hover:text-primary group-hover:underline">
                    {product?.banglaName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <p className="mt-1 text-xl font-semibold  text-primary">
                        ${product?.price}
                    </p>
                    <p className="text-sm mt-2 line-through text-muted-foreground">
                        ${product?.discountPrice}
                    </p>
                </div>
            </div>
        </Link>
    );
};
