"use client";

import { memo } from "react";

import { Product } from "@/types/product-type";

type Props = {
    product: Product;
};

export const ProductPricing = memo(function ProductPricing({ product }: Props) {
    const hasDiscount = product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="mb-6 rounded-xl bg-green-600 p-6 text-center font-bold text-white">
            <div className="mb-2 text-lg text-red-100 line-through">
                নিয়মিত মূল্য: ৳{product.price.toLocaleString()} টাকা
            </div>
            <div className="text-2xl">💥 অফার মূল্য: মাত্র ৳{product.discountPrice.toLocaleString()} টাকা!</div>
        </div>
    );
});
