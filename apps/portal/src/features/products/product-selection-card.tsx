"use client";

import { Product } from "@/types/product-type";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

import { CircleCheckBig, X } from "lucide-react";

export const ProductSelectionCard = ({
    product,
    onRemove,
    isSelected,
    onSelect,
}: {
    product: Product;
    onRemove?: (productId: string) => void;
    isSelected?: boolean;
    onSelect?: (productId: string) => void;
}) => {
    return (
        <div
            className={cn(
                "space-y-2 relative w-44 h-fit border-2 rounded-md p-2 sm:p-4",
                isSelected && "border-primary"
            )}
            onClick={() => onSelect?.(product.id)}
        >
            {isSelected && (
                <CircleCheckBig className="absolute top-2 right-1 size-6 text-primary" />
            )}

            {onRemove && (
                <button
                    className="absolute -top-2.5 -right-2.5 bg-primary text-primary-foreground rounded-full p-1.5"
                    onClick={() => onRemove?.(product.id)}
                >
                    <X className="size-6" />
                </button>
            )}
            <Image
                src={product.photoURL || "/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={300}
                className="size-28 object-cover mx-auto rounded-sm"
            />
            <p className="text-sm line-clamp-2 min-h-9 font-medium text-center">
                {product.name}
            </p>
        </div>
    );
};
