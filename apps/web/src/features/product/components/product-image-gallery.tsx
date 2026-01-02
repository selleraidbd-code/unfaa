"use client";

import { memo } from "react";
import Image from "next/image";

import { Package } from "lucide-react";

type Props = {
    photoURL: string;
    productName: string;
    discountPercent?: number;
};

export const ProductImageGallery = memo(function ProductImageGallery({
    photoURL,
    productName,
    discountPercent,
}: Props) {
    return (
        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100">
            {photoURL ? (
                <>
                    <Image
                        src={photoURL}
                        alt={productName}
                        className="h-full w-full object-contain"
                        width={1000}
                        height={1000}
                    />
                    {discountPercent !== undefined && discountPercent > 0 && (
                        <div className="absolute top-4 right-4 rounded-full bg-red-600 px-3 py-2 font-bold text-white shadow-lg">
                            {discountPercent}% ছাড়
                        </div>
                    )}
                </>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Package className="h-24 w-24 text-gray-300" />
                </div>
            )}
        </div>
    );
});
