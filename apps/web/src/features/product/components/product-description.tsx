"use client";

import { memo } from "react";

import { Product } from "@/types/product-type";
import { HtmlRenderer } from "@/components/shared/html-renderer";

type Props = {
    product: Product;
    images: string[];
};

export const ProductDescription = memo(function ProductDescription({ product, images }: Props) {
    return (
        <>
            <div className="mb-4 rounded-xl border-l-6 border-blue-500 bg-blue-50 p-5">
                <h3 className="mb-3 text-xl font-bold text-blue-600">সংক্ষিপ্ত বিবরণ</h3>
                <div className="leading-relaxed text-gray-800">{product.description}</div>
            </div>
            {images[1] && <img src={images[1]} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}

            <div className="mb-4 rounded-xl border-l-6 border-gray-500 bg-gray-100 p-5">
                <h3 className="mb-3 text-xl font-bold text-gray-700">বিস্তারিত বিবরণ</h3>
                <HtmlRenderer html={product.fullDescription} />
            </div>
            {images[2] && <img src={images[2]} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}
        </>
    );
});
