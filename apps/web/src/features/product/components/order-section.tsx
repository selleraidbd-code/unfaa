"use client";

import { memo } from "react";

import { Product, ProductVariantOption } from "@/types/product-type";

import { DeliveryZoneSelector } from "./delivery-zone-selector";
import { OrderForm } from "./order-form";
import { ProductVariants } from "./product-variants";

type OrderSectionProps = {
    product: Product;
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
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVariantChange: (variantId: string, option: ProductVariantOption) => void;
    setSelectedDeliveryZone: (zoneId: string) => void;
    handleSubmit: () => void;
};

export const OrderSection = memo(function OrderSection({
    product,
    formData,
    errors,
    isSubmitting,
    selectedDeliveryZone,
    selectedVariants,
    handleInputChange,
    handleVariantChange,
    setSelectedDeliveryZone,
    handleSubmit,
}: OrderSectionProps) {
    return (
        <>
            <h2 className="mb-6 text-center text-3xl font-bold text-red-600">অর্ডার করুন 🛒</h2>

            {product.productVariant && product.productVariant.length > 0 && (
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
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
            />
        </>
    );
});
