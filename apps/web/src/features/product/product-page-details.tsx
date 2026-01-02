"use client";

import { useMemo } from "react";
import Image from "next/image";

import { FeaturedProducts } from "@/features/product/components/featured-products";
import { OrderSection } from "@/features/product/components/order-section";
import { ProductDescription } from "@/features/product/components/product-description";
import { ProductFAQ } from "@/features/product/components/product-faq";
import { ProductFooter } from "@/features/product/components/product-footer";
import { ProductImageGallery } from "@/features/product/components/product-image-gallery";
import { ProductPricing } from "@/features/product/components/product-pricing";
import { ProductVideo } from "@/features/product/components/product-video";
import { ProductWarranty } from "@/features/product/components/product-warranty";
import { useOrderForm } from "@/features/product/hooks/use-order-form";
import { Section } from "@workspace/ui/landing/types";

import { FeatureProduct } from "@/types/landing-type";
import { Product } from "@/types/product-type";

type Props = {
    product: Product;
    featureProducts: FeatureProduct[];
    title: string;
    shopSlug: string;
    section: Section | undefined;
};

export const ProductPageDetails = ({ product, featureProducts, title, shopSlug, section }: Props) => {
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
        selectedPackage,
        packages,
        totalAmount,
        handleInputChange,
        handleVariantChange,
        setSelectedDeliveryZone,
        handlePackageSelect,
        handleSubmit,
    } = useOrderForm(product, shopSlug);

    const imageOne = product.images?.[0];
    const imageTwo = product.images?.[1];
    const imageThree = product.images?.[2];
    const imageFour = product.images?.[3];

    return (
        <div className="min-h-screen bg-gray-50 pb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            <div className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white px-4 py-6 shadow-lg lg:space-y-6">
                <h1 className="px-4 text-center text-3xl leading-snug font-bold text-red-600">
                    {title || product.banglaName}
                </h1>

                <ProductImageGallery
                    photoURL={product.photoURL}
                    productName={product.name}
                    discountPercent={discountPercent}
                />

                <ProductPricing price={product.price} discountPrice={product.discountPrice} />

                {imageOne && (
                    <Image
                        src={imageOne}
                        alt="Product"
                        className="w-full rounded-xl shadow-md"
                        width={1000}
                        height={1000}
                    />
                )}

                <ProductDescription
                    description={product.description}
                    imageTwo={imageTwo}
                    imageThree={imageThree}
                    fullDescription={product.fullDescription}
                />

                {product.warranty && <ProductWarranty warranty={product.warranty} />}

                <div className="rounded-xl bg-gradient-to-r from-red-600 to-red-400 p-2 text-center font-bold text-white md:p-6">
                    <div className="text-lg leading-relaxed">
                        🚚 আপনি রাইডারের সামনে প্রোডাক্ট চেক করে তারপরে রাইডারকে টাকা দিবেন।
                        <br />
                        💰 অগ্রীম এক টাকাও দেয়া লাগবে না!
                    </div>
                </div>

                {product.videoLink && <ProductVideo videoLink={product.videoLink} />}

                {imageFour && (
                    <Image
                        src={imageFour}
                        alt="Product"
                        className="mb-4 w-full rounded-xl shadow-md"
                        width={1000}
                        height={1000}
                    />
                )}

                {section && <ProductFAQ section={section} />}

                <OrderSection
                    product={product}
                    packages={packages}
                    formData={formData}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    selectedDeliveryZone={selectedDeliveryZone}
                    selectedVariants={selectedVariants}
                    selectedPackage={selectedPackage}
                    totalAmount={totalAmount}
                    handleInputChange={handleInputChange}
                    handleVariantChange={handleVariantChange}
                    setSelectedDeliveryZone={setSelectedDeliveryZone}
                    handlePackageSelect={handlePackageSelect}
                    handleSubmit={handleSubmit}
                />

                <FeaturedProducts featureProducts={featureProducts} shopSlug={shopSlug} />

                <ProductFooter banglaName={product.banglaName} shopSlug={shopSlug} />
            </div>
        </div>
    );
};
