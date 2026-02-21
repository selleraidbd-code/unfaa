"use client";

import { useMemo } from "react";
import Image from "next/image";

import { ContactButtons } from "@/features/product/components/contact-buttons";
import { FeaturedProducts } from "@/features/product/components/featured-products";
import { OrderSection } from "@/features/product/components/order-section";
import { ProductFooter } from "@/features/product/components/product-footer";
import { ProductImageGallery } from "@/features/product/components/product-image-gallery";
import { ProductPricing } from "@/features/product/components/product-pricing";
import { ProductVideo } from "@/features/product/components/product-video";
import { ProductWarranty } from "@/features/product/components/product-warranty";
import { useOrderForm } from "@/features/product/hooks/use-order-form";
import { FAQ01 } from "@/features/shop/landing-page/components/faq-1";
import { Testimonials } from "@/features/shop/landing-page/components/testimonials";
import { EComponentType } from "@workspace/ui/landing/types";

import { LandingPage } from "@/types/landing-type";
import { HtmlRenderer } from "@/components/shared/html-renderer";

type Props = {
    landingPage: LandingPage;
    domain: string;
};

export const LandingPage01 = ({ landingPage, domain }: Props) => {
    const product = landingPage.product;
    const featureProducts = landingPage.featureProducts;
    const shopSlug = domain;
    const sections = landingPage.section;
    const title = landingPage.name;

    // Find FAQ section (first section or FAQ type)
    const faqSection =
        sections?.find((s) => s.sectionType === EComponentType.FAQ) ||
        (sections && sections.length > 0 ? sections[0] : undefined);

    // Find Testimonials / Customer Review section
    const testimonialsSection = sections?.find((s) => s.sectionType === EComponentType.TESTIMONIALS);

    // Find Contact section
    const contactSection = sections?.find((s) => s.sectionType === EComponentType.CTA);

    const discountPercent = useMemo(
        () =>
            product.discountPrice < product.price
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0,
        [product.price, product.discountPrice]
    );

    const firstImage = product.images?.[0];
    const secondImage = product.images?.[1];
    const otherImages = product.images?.slice(2);

    const {
        formData,
        errors,
        isSubmitting,
        selectedDeliveryZone,
        selectedVariants,
        selectedPackage,
        selectedPackageProductVariants,
        packages,
        totalAmount,
        handleInputChange,
        handleVariantChange,
        setSelectedDeliveryZone,
        handlePackageSelect,
        handlePackageProductVariantChange,
        handleSubmit,
    } = useOrderForm(product, shopSlug);

    const theme = {
        primary: contactSection?.imgURL || "#dc2626",
        secondary: contactSection?.bgURL || "#fef2f2",
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 pb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                <style jsx global>{`
                    :root {
                        --theme-primary: ${theme.primary};
                        --theme-secondary: ${theme.secondary};
                    }
                `}</style>
                <div className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white px-4 py-6 shadow-lg lg:space-y-6">
                    <h1 className="px-4 text-center text-3xl leading-snug font-bold text-[var(--theme-primary)]">
                        {title || product.banglaName}
                    </h1>

                    <ProductImageGallery
                        photoURL={product.photoURL}
                        productName={product.name}
                        discountPercent={discountPercent}
                    />

                    <ProductPricing price={product.price} discountPrice={product.discountPrice} />

                    <div className="mb-4 rounded-xl border-l-4 border-[var(--theme-primary)] bg-[var(--theme-secondary)] p-5 lg:border-l-6">
                        <h3 className="mb-3 text-xl font-bold text-[var(--theme-primary)]">সংক্ষিপ্ত বিবরণ</h3>
                        <HtmlRenderer html={product.description} />
                    </div>

                    {firstImage && (
                        <Image
                            src={firstImage}
                            alt="Product"
                            className="mb-4 w-full rounded-xl shadow-md"
                            width={1000}
                            height={1000}
                        />
                    )}

                    {/* Contact section */}
                    {contactSection && (
                        <ContactButtons
                            whatsappNumber={contactSection.title}
                            facebookPageId={contactSection.subTitle}
                        />
                    )}

                    <div className="mb-4 rounded-xl border-l-4 border-gray-500 bg-gray-100 p-5 lg:border-l-6">
                        <h3 className="mb-3 text-xl font-bold text-gray-700">বিস্তারিত বিবরণ</h3>
                        <HtmlRenderer html={product.fullDescription} />
                    </div>
                    {secondImage && (
                        <Image
                            src={secondImage}
                            alt="Product"
                            className="mb-4 w-full rounded-xl shadow-md"
                            width={1000}
                            height={1000}
                        />
                    )}

                    {product.warranty && <ProductWarranty warranty={product.warranty} />}

                    {/* Customer Review / Testimonials Section */}
                    {testimonialsSection && <Testimonials section={testimonialsSection} />}

                    <div className="rounded-xl bg-[var(--theme-primary)] p-2 text-center font-bold text-white md:p-6">
                        <div className="text-lg leading-relaxed">
                            🚚 আপনি রাইডারের সামনে প্রোডাক্ট চেক করে তারপরে রাইডারকে টাকা দিবেন।
                            <br />
                            💰 অগ্রীম এক টাকাও দেয়া লাগবে না!
                        </div>
                    </div>

                    {product.videoLink && <ProductVideo videoLink={product.videoLink} />}

                    {faqSection && <FAQ01 section={faqSection} />}

                    <OrderSection
                        theme={{ primary: theme.primary, secondary: theme.secondary }}
                        product={product}
                        packages={packages}
                        specialNote={contactSection?.buttonText}
                        formData={formData}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        selectedDeliveryZone={selectedDeliveryZone}
                        selectedVariants={selectedVariants}
                        selectedPackage={selectedPackage}
                        selectedPackageProductVariants={selectedPackageProductVariants}
                        totalAmount={totalAmount}
                        handleInputChange={handleInputChange}
                        handleVariantChange={handleVariantChange}
                        setSelectedDeliveryZone={setSelectedDeliveryZone}
                        handlePackageSelect={handlePackageSelect}
                        handlePackageProductVariantChange={handlePackageProductVariantChange}
                        handleSubmit={handleSubmit}
                    />

                    <FeaturedProducts featureProducts={featureProducts} shopSlug={shopSlug} />

                    <ProductFooter banglaName={product.banglaName} shopSlug={shopSlug} />
                </div>
            </div>
        </>
    );
};
