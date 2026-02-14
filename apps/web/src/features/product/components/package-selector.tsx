"use client";

import { memo } from "react";
import Image from "next/image";

import { cn } from "@workspace/ui/lib/utils";

import { Package } from "@/types/landing-type";
import { ProductVariantOption } from "@/types/product-type";

type PackageSelectorProps = {
    packages: Package[];
    selectedPackageId: string | null;
    onPackageSelect: (packageId: string | null) => void;
    selectedPackageProductVariants: Record<string, Record<string, ProductVariantOption>>;
    onPackageProductVariantChange: (packageProductId: string, variantId: string, option: ProductVariantOption) => void;
};

export const PackageSelector = memo(function PackageSelector({
    packages,
    selectedPackageId,
    onPackageSelect,
    selectedPackageProductVariants,
    onPackageProductVariantChange,
}: PackageSelectorProps) {
    if (!packages || packages.length === 0) {
        return null;
    }

    const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

    // Find package products that need user variant input:
    // packageProductVariants is empty BUT product has productVariant
    const productsNeedingVariants =
        selectedPackage?.packageProducts.filter(
            (pp) => pp.packageProductVariants.length === 0 && pp.product?.productVariant && pp.product.productVariant.length > 0
        ) ?? [];

    return (
        <div className="mb-5 flex flex-col gap-3">
            {packages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;

                return (
                    <div
                        key={pkg.id}
                        onClick={() => onPackageSelect(isSelected ? null : pkg.id)}
                        className={cn(
                            "flex cursor-pointer items-center gap-3.5 rounded-xl border-2 p-4 text-lg transition-all duration-200 max-[480px]:flex-row max-[480px]:items-start",
                            "bg-[var(--order-container-bg)] hover:border-[var(--order-primary)]",
                            isSelected ? "border-[var(--order-primary)]" : "border-[var(--order-border)]"
                        )}
                    >
                        <Image
                            src={pkg.img}
                            alt={pkg.title}
                            width={80}
                            height={80}
                            className="h-20 w-20 shrink-0 rounded-lg object-cover max-[480px]:h-[70px] max-[480px]:w-[70px]"
                        />
                        <div className="flex flex-col">
                            <h4 className="m-0 text-base font-semibold text-[var(--order-primary)]">{pkg.title}</h4>
                            <p className="text-lg font-bold">৳ {pkg.codAmount.toLocaleString("bn-BD")} টাকা</p>
                        </div>
                    </div>
                );
            })}

            {/* Variant selectors for package products that need user input */}
            {productsNeedingVariants.length > 0 && (
                <div className="mt-1 flex flex-col gap-4">
                    <label className="block text-lg font-bold text-gray-700">ভ্যারিয়েন্ট নির্বাচন করুন</label>
                    {productsNeedingVariants.map((pp) => {
                        const productVariants = pp.product.productVariant!;
                        const currentSelections = selectedPackageProductVariants[pp.id] ?? {};

                        return (
                            <div
                                key={pp.id}
                                className="rounded-xl border border-[var(--order-border)] bg-white/60 p-4"
                            >
                                {/* Product header */}
                                <div className="mb-3 flex items-center gap-3">
                                    <Image
                                        src={pp.product.photoURL}
                                        alt={pp.product.name}
                                        width={44}
                                        height={44}
                                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                    />
                                    <p className="text-[15px] font-bold leading-tight text-gray-800">
                                        {pp.product.name}
                                    </p>
                                </div>

                                {/* Variant groups */}
                                {productVariants.map((variant) => (
                                    <div key={variant.id} className="mb-4 last:mb-0">
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            {variant.name} নির্বাচন করুন:
                                        </label>
                                        <div
                                            className={
                                                variant.options.some((opt) => opt.imgUrl)
                                                    ? "space-y-2"
                                                    : "grid grid-cols-2 gap-2"
                                            }
                                        >
                                            {variant.options.map((option) => {
                                                const isOptionSelected =
                                                    currentSelections[variant.id]?.id === option.id;

                                                return (
                                                    <div
                                                        key={option.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPackageProductVariantChange(pp.id, variant.id, option);
                                                        }}
                                                        className={cn(
                                                            "flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition-all duration-150",
                                                            "bg-[var(--order-container-bg)] hover:border-[var(--order-primary)]",
                                                            isOptionSelected
                                                                ? "border-[var(--order-primary)] shadow-sm"
                                                                : "border-[var(--order-border)]"
                                                        )}
                                                    >
                                                        {/* Radio indicator */}
                                                        <span
                                                            className={cn(
                                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                                                isOptionSelected
                                                                    ? "border-[var(--order-primary)] bg-[var(--order-primary)]"
                                                                    : "border-gray-300 bg-white"
                                                            )}
                                                        >
                                                            {isOptionSelected && (
                                                                <svg
                                                                    className="h-3 w-3 text-white"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={3}
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </span>

                                                        {option.imgUrl && (
                                                            <img
                                                                src={option.imgUrl}
                                                                alt={option.name}
                                                                className="h-14 w-14 shrink-0 rounded-md object-cover"
                                                            />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p
                                                                className={cn(
                                                                    "text-sm font-semibold leading-snug",
                                                                    isOptionSelected
                                                                        ? "text-[var(--order-primary)]"
                                                                        : "text-gray-700"
                                                                )}
                                                            >
                                                                {option.name}
                                                            </p>
                                                            {option.extraPrice > 0 && (
                                                                <p className="mt-0.5 text-xs font-medium text-gray-500">
                                                                    +৳{option.extraPrice.toLocaleString()} টাকা
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
