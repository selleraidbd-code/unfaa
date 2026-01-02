"use client";

import { memo } from "react";

import { Package } from "@/types/landing-type";
import { Product, ProductVariantOption } from "@/types/product-type";

import { DeliveryZoneSelector } from "./delivery-zone-selector";
import { OrderForm } from "./order-form";
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
    return (
        <>
            <h2 className="mb-6 text-center text-3xl font-bold text-red-600">অর্ডার করুন 🛒</h2>

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

            <DeliveryZoneSelector
                zones={product.delivery.deliveryZones}
                selectedZoneId={selectedDeliveryZone}
                onZoneChange={setSelectedDeliveryZone}
            />

            <OrderForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                totalAmount={totalAmount}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
            />
        </>
    );
});
