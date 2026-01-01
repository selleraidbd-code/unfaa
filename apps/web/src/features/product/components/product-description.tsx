"use client";

import { memo } from "react";

import { Product } from "@/types/product-type";
import { HtmlRenderer } from "@/components/shared/html-renderer";

type Props = {
    product: Product;
    imageTwo?: string;
    imageThree?: string;
};

export const ProductDescription = memo(function ProductDescription({ product, imageTwo, imageThree }: Props) {
    return (
        <>
            <div className="mb-4 rounded-xl border-l-6 border-blue-500 bg-blue-50 p-5">
                <h3 className="mb-3 text-xl font-bold text-blue-600">সংক্ষিপ্ত বিবরণ</h3>
                <HtmlRenderer html={product.description} />
            </div>
            {imageTwo && <img src={imageTwo} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}

            <div className="mb-4 rounded-xl border-l-6 border-gray-500 bg-gray-100 p-5">
                <h3 className="mb-3 text-xl font-bold text-gray-700">বিস্তারিত বিবরণ</h3>
                <HtmlRenderer html={product.fullDescription} />
            </div>
            {imageThree && <img src={imageThree} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}
        </>
    );
});
