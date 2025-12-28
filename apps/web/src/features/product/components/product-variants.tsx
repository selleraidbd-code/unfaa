"use client";

import { Product, ProductVariant, ProductVariantOption } from "@/types/product-type";

type Props = {
    variants: ProductVariant[];
    selectedVariants: Record<string, ProductVariantOption>;
    onVariantChange: (variantId: string, option: ProductVariantOption) => void;
};

export const ProductVariants = ({ variants, selectedVariants, onVariantChange }: Props) => {
    if (!variants || variants.length === 0) {
        return null;
    }

    return (
        <>
            {variants.map((variant) => (
                <div key={variant.id} className="mb-6">
                    <label className="mb-3 block text-lg font-bold text-gray-700">{variant.name} নির্বাচন করুন:</label>
                    <div className={variant.options.some((opt) => opt.imgUrl) ? "space-y-3" : "grid grid-cols-2 gap-3"}>
                        {variant.options.map((option) => (
                            <div key={option.id}>
                                <input
                                    type="radio"
                                    id={`variant-${variant.id}-option-${option.id}`}
                                    name={`variant-${variant.id}`}
                                    value={option.id}
                                    checked={selectedVariants[variant.id]?.id === option.id}
                                    onChange={() => onVariantChange(variant.id, option)}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={`variant-${variant.id}-option-${option.id}`}
                                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-green-50 p-4 transition-all ${
                                        selectedVariants[variant.id]?.id === option.id
                                            ? "border-green-600"
                                            : "border-green-50"
                                    } hover:border-green-600`}
                                >
                                    {option.imgUrl && (
                                        <img
                                            src={option.imgUrl}
                                            alt={option.name}
                                            className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h4 className="text-base font-bold text-green-600">{option.name}</h4>
                                        {option.extraPrice > 0 && (
                                            <p className="mt-1 text-lg font-bold text-gray-800">
                                                💰 অতিরিক্ত ৳{option.extraPrice.toLocaleString()} টাকা
                                            </p>
                                        )}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};
