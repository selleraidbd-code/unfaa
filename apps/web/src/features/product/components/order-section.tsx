"use client";

import { memo, useMemo } from "react";

import { Package } from "@/types/landing-type";
import { Product, ProductVariantOption } from "@/types/product-type";

import { DeliveryZoneSelector } from "./delivery-zone-selector";
import { PackageSelector } from "./package-selector";
import { ProductVariants } from "./product-variants";

/** Theme for order section: primary (required) and optional secondary for gradients/backgrounds. */
export type OrderSectionTheme = {
    primary: string;
    secondary?: string;
};

const DEFAULT_THEME: OrderSectionTheme = {
    primary: "#0fa54c",
    secondary: "#e8f0ff",
};

/** Darken a hex color by a factor 0–1 (e.g. 0.15 = 15% darker). */
function darkenHex(hex: string, factor: number): string {
    const match = hex.replace(/^#/, "").match(/.{2}/g);
    if (!match) return hex;
    const rgb = match.map((x) => Math.max(0, Math.min(255, parseInt(x, 16) * (1 - factor))));
    const [r, g, b] = [rgb[0] ?? 0, rgb[1] ?? 0, rgb[2] ?? 0];
    return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
}

/** Lighten a hex color by adding white (factor 0–1). */
function lightenHex(hex: string, factor: number): string {
    const match = hex.replace(/^#/, "").match(/.{2}/g);
    if (!match) return hex;
    const rgb = match.map((x) => {
        const v = parseInt(x, 16);
        return Math.round(v + (255 - v) * factor);
    });
    const [r, g, b] = [rgb[0] ?? 0, rgb[1] ?? 0, rgb[2] ?? 0];
    return `#${[r, g, b].map((x) => Math.min(255, x).toString(16).padStart(2, "0")).join("")}`;
}

type OrderSectionProps = {
    product: Product;
    packages?: Package[];
    /** Optional theme: primary and optional secondary color. Defaults to green primary + light blue secondary. */
    theme?: OrderSectionTheme;
    formData: {
        name: string;
        address: string;
        phone: string;
    };
    errors: {
        name?: string;
        address?: string;
        phone?: string;
    };
    isSubmitting: boolean;
    selectedDeliveryZone: string;
    selectedVariants: Record<string, ProductVariantOption>;
    selectedPackage: Package | null;
    selectedPackageProductVariants: Record<string, Record<string, ProductVariantOption>>;
    totalAmount: number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVariantChange: (variantId: string, option: ProductVariantOption) => void;
    setSelectedDeliveryZone: (zoneId: string) => void;
    handlePackageSelect: (packageId: string | null) => void;
    handlePackageProductVariantChange: (
        packageProductId: string,
        variantId: string,
        option: ProductVariantOption
    ) => void;
    handleSubmit: () => void;
};

export const OrderSection = memo(function OrderSection({
    product,
    packages = [],
    theme: themeProp,
    formData,
    errors,
    isSubmitting,
    selectedDeliveryZone,
    selectedVariants,
    selectedPackage,
    selectedPackageProductVariants,
    totalAmount,
    handleInputChange,
    handleVariantChange,
    setSelectedDeliveryZone,
    handlePackageSelect,
    handlePackageProductVariantChange,
    handleSubmit,
}: OrderSectionProps) {
    const theme = themeProp ?? DEFAULT_THEME;
    const primary = theme.primary;
    const secondary = theme.secondary ?? lightenHex(primary, 0.85);

    const themeStyle = useMemo(
        () =>
            ({
                "--order-primary": primary,
                "--order-primary-hover": darkenHex(primary, 0.12),
                "--order-secondary": secondary,
                "--order-secondary-light": lightenHex(secondary, 0.4),
                "--order-border": lightenHex(primary, 0.75),
                "--order-container-bg": lightenHex(secondary, 0.5),
                "--order-header-from": secondary,
                "--order-header-to": lightenHex(secondary, 0.6),
                "--order-header-border": lightenHex(secondary, 0.3),
            }) as React.CSSProperties,
        [primary, secondary]
    );

    console.log("packages", packages);

    return (
        <section id="order-section" className="scroll-mt-10 py-6 lg:scroll-mt-20 lg:py-12">
            <div
                className="landing-width rounded-2xl border-2 px-4 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                style={{
                    ...themeStyle,
                    borderColor: "var(--order-border)",
                    backgroundColor: "var(--order-container-bg)",
                }}
            >
                <div
                    className="mb-[18px] rounded-xl border px-[18px] py-4 text-center text-[22px] font-bold"
                    style={{
                        borderColor: "var(--order-header-border)",
                        background: "linear-gradient(to right, var(--order-header-from), var(--order-header-to))",
                        color: "var(--order-primary)",
                    }}
                >
                    অর্ডার করুন
                </div>

                {packages.length > 0 && (
                    <PackageSelector
                        packages={packages}
                        selectedPackageId={selectedPackage?.id || null}
                        onPackageSelect={handlePackageSelect}
                        selectedPackageProductVariants={selectedPackageProductVariants}
                        onPackageProductVariantChange={handlePackageProductVariantChange}
                    />
                )}

                {!selectedPackage && product.productVariant && product.productVariant.length > 0 && (
                    <ProductVariants
                        variants={product.productVariant}
                        selectedVariants={selectedVariants}
                        onVariantChange={handleVariantChange}
                    />
                )}

                <div>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="নাম"
                        className="mb-3.5 w-full rounded-[10px] border border-[#ccc] bg-white px-3.5 py-4 text-lg transition-colors outline-none focus:border-[var(--order-primary)]"
                    />
                    {errors.name && (
                        <div className="mt-2.5 mb-4 rounded-md border-l-[5px] border-l-red-500 bg-[#ffdddd] p-2.5 text-[#b30000]">
                            {errors.name}
                        </div>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="ঠিকানা (জেলা, থানা ও গ্রামের নাম)"
                        className="mb-3.5 w-full rounded-[10px] border border-[#ccc] bg-white px-3.5 py-4 text-lg transition-colors outline-none focus:border-[var(--order-primary)]"
                    />
                    {errors.address && (
                        <div className="mt-2.5 mb-4 rounded-md border-l-[5px] border-l-red-500 bg-[#ffdddd] p-2.5 text-[#b30000]">
                            {errors.address}
                        </div>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="সচল মোবাইল নাম্বার"
                        className="mb-3.5 w-full rounded-[10px] border border-[#ccc] bg-white px-3.5 py-4 text-lg transition-colors outline-none focus:border-[var(--order-primary)]"
                    />
                    {errors.phone && (
                        <div className="mt-2.5 mb-4 rounded-md border-l-[5px] border-l-red-500 bg-[#ffdddd] p-2.5 text-[#b30000]">
                            {errors.phone}
                        </div>
                    )}
                </div>

                <DeliveryZoneSelector
                    zones={product.delivery.deliveryZones}
                    selectedZoneId={selectedDeliveryZone}
                    onZoneChange={setSelectedDeliveryZone}
                />

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="order-section-submit mt-2.5 w-full cursor-pointer rounded-xl border-none px-4 py-4 text-[22px] font-bold text-white transition-all duration-200 hover:bg-[var(--order-primary-hover)] disabled:cursor-not-allowed disabled:bg-[#999]"
                    style={{
                        backgroundColor: "var(--order-primary)",
                    }}
                >
                    {isSubmitting ? "অর্ডার করা হচ্ছে..." : `অর্ডার করুন (${totalAmount?.toLocaleString()} টাকা)`}
                </button>
            </div>
        </section>
    );
});
