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
            className=" bg-blue-100 rounded-md p-4 block"
        >
            <Image
                src={"/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.name}
        </Link>
    );
};
