"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";

import { FeatureProduct } from "@/types/landing-type";
import { getLink } from "@/lib/get-link";

type Props = {
    featureProducts: FeatureProduct[];
    shopSlug: string;
};

export const FeaturedProducts = memo(function FeaturedProducts({ featureProducts, shopSlug }: Props) {
    if (!featureProducts || featureProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-10 space-y-6">
            <h2 className="text-center text-xl font-bold sm:text-2xl md:text-[27px]">আপনার জন্য আরও প্রোডাক্ট 🔥</h2>

            <div className="grid grid-cols-2 gap-3 md:gap-4 xl:gap-6">
                {featureProducts.map((featureProduct) => {
                    const product = featureProduct.product;
                    const discountPercent =
                        product.discountPrice < product.price
                            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                            : 0;

                    const productLink = getLink({
                        shopSlug,
                        path: `/${product.slug}`,
                    });

                    return (
                        <Link
                            key={featureProduct.productId}
                            href={productLink}
                            className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl md:rounded-xl"
                        >
                            {/* Discount Badge */}
                            {discountPercent > 0 && (
                                <div className="absolute top-1 right-1 z-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg md:top-3 md:right-3 md:px-3 md:py-1.5">
                                    {discountPercent}% ছাড়
                                </div>
                            )}

                            {/* Product Image */}
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                {product.photoURL ? (
                                    <Image
                                        src={product.photoURL}
                                        alt={product.banglaName || product.name}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        width={400}
                                        height={400}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-red-600 sm:min-h-[3rem] sm:text-base">
                                    {product.banglaName || product.name}
                                </h3>

                                {/* Pricing */}
                                <div className="flex flex-col gap-1">
                                    {product.discountPrice < product.price ? (
                                        <>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-primary text-lg font-bold">
                                                    ৳ {product.discountPrice.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    ৳{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold">৳ {product.price.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
});
