"use client";

import { memo } from "react";
import Image from "next/image";

import { cn } from "@workspace/ui/lib/utils";

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
        </div>
    );
});
