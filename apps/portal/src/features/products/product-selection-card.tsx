"use client";

import Image from "next/image";

import { cn } from "@workspace/ui/lib/utils";
import { CircleCheckBig, X } from "lucide-react";

import { Product } from "@/types/product-type";

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
                "relative h-fit w-[156px] space-y-2 rounded-md border-2 p-2 sm:w-40 sm:p-4 lg:w-44",
                isSelected && "border-primary"
            )}
            onClick={() => onSelect?.(product.id)}
        >
            {isSelected && <CircleCheckBig className="text-primary absolute top-2 right-1 size-6" />}

            {onRemove && (
                <button
                    className="bg-primary text-primary-foreground absolute -top-2.5 -right-2.5 rounded-full p-1.5"
                    onClick={() => onRemove?.(product.id)}
                >
                    <X className="size-5 sm:size-6" />
                </button>
            )}
            <Image
                src={product.photoURL || "/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={300}
                className="mx-auto size-28 rounded-sm object-cover"
            />
            <p className="line-clamp-2 min-h-9 text-center text-sm font-medium">{product.name}</p>
        </div>
    );
};
