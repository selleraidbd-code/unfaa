"use client";

import { useMemo } from "react";

import { Product } from "@/types/product-type";

import { CashOnDeliveryBanner } from "./components/cash-on-delivery-banner";
import { OrderSection } from "./components/order-section";
import { ProductDescription } from "./components/product-description";
import { ProductFooter } from "./components/product-footer";
import { ProductHeader } from "./components/product-header";
import { ProductImageGallery } from "./components/product-image-gallery";
import { ProductPricing } from "./components/product-pricing";
import { ProductVideo } from "./components/product-video";
import { ProductWarranty } from "./components/product-warranty";
import { useOrderForm } from "./hooks/use-order-form";

type Props = {
    product: Product;
    shopSlug: string;
};

export const ProductPageDetails = ({ product, shopSlug }: Props) => {
    const discountPercent = useMemo(
        () =>
            product.discountPrice < product.price
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0,
        [product.price, product.discountPrice]
    );

    const {
        formData,
        errors,
        isSubmitting,
        selectedDeliveryZone,
        selectedVariants,
        handleInputChange,
        handleVariantChange,
        setSelectedDeliveryZone,
        handleSubmit,
    } = useOrderForm(product, shopSlug);

    const imageOne = product.images?.[0];
    const imageTwo = product.images?.[1];
    const imageThree = product.images?.[2];
    const imageFour = product.images?.[3];

    return (
        <div className="min-h-screen bg-gray-50 pb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            <ProductHeader product={product} />

            <div className="mx-auto my-6 max-w-3xl rounded-xl bg-white px-4 py-6 shadow-lg">
                <ProductImageGallery
                    photoURL={product.photoURL}
                    productName={product.name}
                    discountPercent={discountPercent}
                />

                <ProductPricing product={product} />

                {imageOne && <img src={imageOne} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}

                <ProductDescription product={product} imageTwo={imageTwo} imageThree={imageThree} />

                {product.warranty && <ProductWarranty warranty={product.warranty} />}

                <CashOnDeliveryBanner />

                {product.videoLink && <ProductVideo videoLink={product.videoLink} />}

                {imageFour && <img src={imageFour} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}

                <OrderSection
                    product={product}
                    formData={formData}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    selectedDeliveryZone={selectedDeliveryZone}
                    selectedVariants={selectedVariants}
                    handleInputChange={handleInputChange}
                    handleVariantChange={handleVariantChange}
                    setSelectedDeliveryZone={setSelectedDeliveryZone}
                    handleSubmit={handleSubmit}
                />

                <ProductFooter product={product} shopSlug={shopSlug} />
            </div>
        </div>
    );
};
