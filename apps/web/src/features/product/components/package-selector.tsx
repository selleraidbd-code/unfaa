"use client";

import { memo } from "react";
import Image from "next/image";

import { Package } from "@/types/landing-type";

type PackageSelectorProps = {
    packages: Package[];
    selectedPackageId: string | null;
    onPackageSelect: (packageId: string | null) => void;
};

export const PackageSelector = memo(function PackageSelector({
    packages,
    selectedPackageId,
    onPackageSelect,
}: PackageSelectorProps) {
    if (!packages || packages.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">📦 প্যাকেজ নির্বাচন করুন</h3>
            <div className="space-y-3">
                {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const totalProducts = pkg.packageProducts.length;

                    return (
                        <div
                            key={pkg.id}
                            onClick={() => onPackageSelect(isSelected ? null : pkg.id)}
                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                isSelected
                                    ? "border-green-500 bg-green-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                                    <Image src={pkg.img} alt={pkg.title} fill className="object-cover" sizes="80px" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{pkg.title}</h4>
                                            <p className="mt-1 text-sm text-gray-600">{totalProducts} টি প্রোডাক্ট</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gre5border-green-500 text-lg font-bold">
                                                ৳{pkg.codAmount.toLocaleString("bn-BD")}
                                            </div>
                                            {pkg.saveAmount > 0 && (
                                                <div className="text-xs text-gray-500 line-through">
                                                    ৳{(pkg.codAmount + pkg.saveAmount).toLocaleString("bn-BD")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {pkg.saveAmount > 0 && (
                                        <div className="mt-2 text-sm font-semibold text-green-600">
                                            💰 {pkg.saveAmount.toLocaleString("bn-BD")} টাকা সাশ্রয়
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
