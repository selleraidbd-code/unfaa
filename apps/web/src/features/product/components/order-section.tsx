"use client";

import { memo } from "react";

import { Package } from "@/types/landing-type";
import { Product, ProductVariantOption } from "@/types/product-type";

import { DeliveryZoneSelector } from "./delivery-zone-selector";
import { PackageSelector } from "./package-selector";
import { ProductVariants } from "./product-variants";

type OrderSectionProps = {
    product: Product;
    packages?: Package[];
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
    totalAmount: number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVariantChange: (variantId: string, option: ProductVariantOption) => void;
    setSelectedDeliveryZone: (zoneId: string) => void;
    handlePackageSelect: (packageId: string | null) => void;
    handleSubmit: () => void;
};

export const OrderSection = memo(function OrderSection({
    product,
    packages = [],
    formData,
    errors,
    isSubmitting,
    selectedDeliveryZone,
    selectedVariants,
    selectedPackage,
    totalAmount,
    handleInputChange,
    handleVariantChange,
    setSelectedDeliveryZone,
    handlePackageSelect,
    handleSubmit,
}: OrderSectionProps) {
    console.log(packages);
    return (
        <section id="order-section" className="scroll-mt-20 py-6 lg:py-12">
            <div className="landing-width rounded-2xl border-2 border-[#eafbea] bg-[#dbeafe] px-4 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <div className="mb-[18px] rounded-xl border border-[#dbe7ff] bg-gradient-to-r from-[#e8f0ff] to-[#f3f7ff] px-[18px] py-4 text-left text-[22px] font-bold text-red-500">
                    অর্ডার করুন
                </div>

                {packages.length > 0 && (
                    <PackageSelector
                        packages={packages}
                        selectedPackageId={selectedPackage?.id || null}
                        onPackageSelect={handlePackageSelect}
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
                        className="mb-3.5 w-full rounded-[10px] border border-[#ccc] bg-white px-3.5 py-4 text-lg transition-colors outline-none focus:border-[#0fa54c]"
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
                        className="mb-3.5 w-full rounded-[10px] border border-[#ccc] bg-white px-3.5 py-4 text-lg transition-colors outline-none focus:border-[#0fa54c]"
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
                        className="mb-3.5 w-full rounded-[10px] border border-[#ccc] bg-white px-3.5 py-4 text-lg transition-colors outline-none focus:border-[#0fa54c]"
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
                    className="mt-2.5 w-full cursor-pointer rounded-xl border-none bg-[#0fa54c] px-4 py-4 text-[22px] font-bold text-white transition-all duration-200 hover:bg-[#0d8c3f] disabled:cursor-not-allowed disabled:bg-[#999]"
                >
                    {isSubmitting ? "অর্ডার করা হচ্ছে..." : `অর্ডার করুন (${totalAmount?.toLocaleString()} টাকা)`}
                </button>
            </div>
        </section>
    );
});
