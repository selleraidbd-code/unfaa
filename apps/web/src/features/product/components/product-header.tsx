"use client";

import { memo } from "react";

import { Product } from "@/types/product-type";

type Props = {
    product: Product;
};

export const ProductHeader = memo(function ProductHeader({ product }: Props) {
    return (
        <header className="bg-white shadow-sm">
            <h1 className="px-4 py-6 text-center text-3xl leading-snug font-bold text-red-600">{product.banglaName}</h1>
        </header>
    );
});
