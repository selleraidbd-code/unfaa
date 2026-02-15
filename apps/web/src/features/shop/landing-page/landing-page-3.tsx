"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { FeaturedProducts } from "@/features/product/components/featured-products";
import { OrderSection } from "@/features/product/components/order-section";
import { ProductFooter } from "@/features/product/components/product-footer";
import { ProductVideo } from "@/features/product/components/product-video";
import { useOrderForm } from "@/features/product/hooks/use-order-form";
import { FAQ02 } from "@/features/shop/landing-page/components/faq-2";
import { Testimonials } from "@/features/shop/landing-page/components/testimonials";
import { EComponentType } from "@workspace/ui/landing/types";
import { cn } from "@workspace/ui/lib/utils";
import { Phone } from "lucide-react";

import { LandingPage as LandingPageType } from "@/types/landing-type";
import { HtmlRenderer } from "@/components/shared/html-renderer";

const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBengaliNumber = (n: number) =>
    String(n)
        .padStart(2, "0")
        .split("")
        .map((c) => BENGALI_DIGITS[parseInt(c, 10)])
        .join("");

/** Ensure a phone number includes the Bangladesh country code (+880). */
const ensureCountryCode = (phone: string): string => {
    const digits = phone.replace(/[^0-9+]/g, "");
    if (digits.startsWith("+")) return digits;
    if (digits.startsWith("880")) return `+${digits}`;
    if (digits.startsWith("0")) return `+880${digits.slice(1)}`;
    return `+880${digits}`;
};

type Props = {
    landingPage: LandingPageType;
    domain: string;
};

export const LandingPage03 = ({ landingPage, domain }: Props) => {
    const product = landingPage.product;
    const featureProducts = landingPage.featureProducts;
    const shopSlug = domain;
    const sections = landingPage.section;
    const title = landingPage.name;
    const firstImage = product.images?.[0];
    const secondImage = product.images?.[1];
    const otherImages = product.images?.slice(2);

    // Find FAQ section
    const faqSection = sections?.find((s) => s.sectionType === EComponentType.FAQ);

    // Find Contact section
    const contactSection = sections?.find((s) => s.sectionType === EComponentType.CTA);

    // Find Features section
    const featuresSection = sections?.find((s) => s.sectionType === EComponentType.FEATURES);

    // Find Testimonials / Customer Review section
    const testimonialsSection = sections?.find((s) => s.sectionType === EComponentType.TESTIMONIALS);

    // Find About/Services section
    const aboutSection = sections?.find((s) => s.sectionType === EComponentType.HERO);
    const aboutImageHave = aboutSection?.imgURL && aboutSection?.imgURL.trim() !== "";

    // Find Banner section
    const bannerSection = sections?.find((s) => s.sectionType === EComponentType.BANNER);

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

    const importantPoints = [
        {
            title: "আমরা অগ্রীম কোন টাকা নেই না। আপনি পন্য হাতে পেয়ে চেক করে তারপরে রাইডার কে টাকা দিবেন",
        },
        {
            title: "অর্ডার করার পরে আমাদের কল সেন্টার থেকে কল দিয়ে অর্ডার কনফার্ম করা হবে। কল দিলে দয়া করে রিসিভ করবেন।",
        },
    ];

    const theme = {
        primary: "#D94C6A",
        secondary: "#FFF6E9",
    };

    return (
        <div className="bg-gray-50" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap");
                :root {
                    --theme-primary: ${theme.primary};
                    --theme-secondary: ${theme.secondary};
                }
                body {
                    font-family: "Hind Siliguri", sans-serif;
                }
                @keyframes pulse-subtle {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 ${theme.primary}66;
                    }
                    70% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px ${theme.primary}00;
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 ${theme.primary}00;
                    }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 3s infinite;
                }
                @keyframes slide-loop {
                    0%,
                    45% {
                        transform: translateX(0);
                    }
                    50%,
                    95% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .slider-wrapper {
                    animation: slide-loop 12s infinite ease-in-out;
                }
                html {
                    scroll-behavior: smooth;
                }
            `}</style>

            <>
                {/* Action Sidebar - Contact Buttons */}
                {contactSection && (
                    <div className="fixed top-1/2 right-2 z-[1000] flex -translate-y-1/2 flex-col gap-2.5">
                        {contactSection.title && (
                            <a
                                href={`tel:${ensureCountryCode(contactSection.title)}`}
                                className="animate-pulse-subtle flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-[var(--theme-primary)] shadow-md transition-colors hover:bg-[var(--theme-secondary)]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                            </a>
                        )}
                        {contactSection.title && (
                            <a
                                href={`https://wa.me/${ensureCountryCode(contactSection.title).replace("+", "")}`}
                                className="animate-pulse-subtle flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-green-500 shadow-md transition-colors hover:bg-green-50"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                                </svg>
                            </a>
                        )}
                        {contactSection.subTitle && (
                            <a
                                href={`https://m.me/${contactSection.subTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="animate-pulse-subtle flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#0084ff] shadow-md transition-colors hover:bg-[#e7f3ff]"
                                aria-label="Messenger"
                            >
                                <svg height={24} width={24} viewBox="0 0 256 256" preserveAspectRatio="xMidYMid">
                                    <defs>
                                        <radialGradient
                                            id="messenger__a"
                                            cx="19.247%"
                                            cy="99.465%"
                                            r="108.96%"
                                            fx="19.247%"
                                            fy="99.465%"
                                        >
                                            <stop offset="0%" stop-color="#09F" />
                                            <stop offset="60.975%" stop-color="#A033FF" />
                                            <stop offset="93.482%" stop-color="#FF5280" />
                                            <stop offset="100%" stop-color="#FF7061" />
                                        </radialGradient>
                                    </defs>
                                    <path
                                        fill="url(#messenger__a)"
                                        d="M128 0C55.894 0 0 52.818 0 124.16c0 37.317 15.293 69.562 40.2 91.835 2.09 1.871 3.352 4.493 3.438 7.298l.697 22.77c.223 7.262 7.724 11.988 14.37 9.054L84.111 243.9a10.218 10.218 0 0 1 6.837-.501c11.675 3.21 24.1 4.92 37.052 4.92 72.106 0 128-52.818 128-124.16S200.106 0 128 0Z"
                                    />
                                    <path
                                        fill="#FFF"
                                        d="m51.137 160.47 37.6-59.653c5.98-9.49 18.788-11.853 27.762-5.123l29.905 22.43a7.68 7.68 0 0 0 9.252-.027l40.388-30.652c5.39-4.091 12.428 2.36 8.82 8.085l-37.6 59.654c-5.981 9.489-18.79 11.852-27.763 5.122l-29.906-22.43a7.68 7.68 0 0 0-9.25.027l-40.39 30.652c-5.39 4.09-12.427-2.36-8.818-8.085Z"
                                    />
                                </svg>
                            </a>
                        )}
                    </div>
                )}

                {/* Header/Banner Section */}
                <header className="border-b border-gray-200 bg-white py-12">
                    <div className="landing-width flex flex-col-reverse items-center gap-12 md:flex-row">
                        <div className="md:w-1/2">
                            <div className="mb-6 h-1 w-16 bg-[var(--theme-primary)]"></div>
                            <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-5xl md:leading-12">
                                {bannerSection?.title || title || product.banglaName}
                            </h1>

                            <HtmlRenderer
                                html={bannerSection?.subTitle || product.description}
                                className="mb-8 border-l-4 border-gray-100 pl-4 text-lg leading-relaxed text-gray-600"
                            />

                            <Link
                                href={`#order-section`}
                                className="inline-block rounded-r-full bg-gray-900 px-7 py-2.5 font-extrabold text-amber-400"
                            >
                                <span className="text-sm font-normal opacity-80">স্পেশাল প্রাইজ: </span>
                                <span className="text-3xl">৳{product.discountPrice.toLocaleString()}</span>
                            </Link>
                        </div>
                        <div className="relative md:w-1/2">
                            <div className="absolute -top-4 -left-4 -z-10 h-24 w-24 rounded-full bg-[var(--theme-secondary)]"></div>
                            <Image
                                src={bannerSection?.imgURL || product.photoURL}
                                alt={product.banglaName}
                                className="h-auto w-full border border-gray-100 bg-white p-2 shadow-2xl"
                                width={600}
                                height={600}
                            />
                        </div>
                    </div>
                </header>

                <div className="flex justify-center py-4 md:hidden">
                    <button
                        onClick={() => {
                            document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="rounded-full bg-[var(--theme-primary)] px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                    >
                        এখনি অর্ডার করুন
                    </button>
                </div>

                <section className="bg-white py-10">
                    <div className="container mx-auto grid max-w-4xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
                        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 text-center">
                            <p className="mb-2 text-2xl">🚚</p>
                            <h4 className="text-sm font-bold">দ্রুত ডেলিভারি</h4>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 text-center">
                            <p className="mb-2 text-2xl">🤝</p>
                            <h4 className="text-sm font-bold">ক্যাশ অন ডেলিভারি</h4>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 text-center">
                            <p className="mb-2 text-2xl">✅</p>
                            <h4 className="text-sm font-bold">১০০% অথেন্টিক</h4>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 text-center">
                            <p className="mb-2 text-2xl">🛡️</p>
                            <h4 className="text-sm font-bold">মান নিশ্চিত</h4>
                        </div>
                    </div>
                </section>

                {/* Services/About Section - title, left: sectionList (title+description), right: imgURL (video/image) */}
                {aboutSection &&
                    ((aboutSection.sectionList && aboutSection.sectionList.length > 0) ||
                        aboutSection.imgURL ||
                        aboutSection.title) && (
                        <section className="bg-gray-900 py-12 text-white">
                            <div className="container mx-auto max-w-4xl px-6">
                                <h2 className="mb-10 text-center text-2xl font-bold tracking-wide uppercase md:text-3xl">
                                    {aboutSection.title || "আমাদের সার্ভিস কেন সেরা?"}
                                </h2>
                                <div
                                    className={cn(
                                        "flex flex-col-reverse gap-8 md:grid",
                                        aboutImageHave ? "md:grid-cols-2" : ""
                                    )}
                                >
                                    <ul className="space-y-6">
                                        {aboutSection.sectionList?.map((service, index) => (
                                            <li key={service.id || index} className="flex items-start gap-4">
                                                <span className="center size-6 rounded bg-[var(--theme-primary)]">
                                                    ✔
                                                </span>
                                                <div>
                                                    <p className="mb-2 text-lg leading-none font-bold">
                                                        {service.title}
                                                    </p>
                                                    <p className="text-sm text-gray-400">{service.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    {aboutImageHave &&
                                        (() => {
                                            const mediaUrl = aboutSection.imgURL || "";
                                            const isEmbedHtml = mediaUrl.trim().startsWith("<");
                                            const isYoutubeUrl =
                                                !isEmbedHtml && /youtube\.com|youtu\.be/i.test(mediaUrl);
                                            const embedSrc =
                                                isYoutubeUrl && mediaUrl
                                                    ? (() => {
                                                          const match = mediaUrl.match(
                                                              /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/
                                                          );
                                                          return match
                                                              ? `https://www.youtube.com/embed/${match[1]}`
                                                              : mediaUrl;
                                                      })()
                                                    : null;
                                            return (
                                                <div className="overflow-hidden rounded-xl border-4 border-gray-800 shadow-2xl">
                                                    {isEmbedHtml ? (
                                                        <div
                                                            className="[&>iframe]:aspect-video [&>iframe]:w-full"
                                                            dangerouslySetInnerHTML={{
                                                                __html: mediaUrl,
                                                            }}
                                                        />
                                                    ) : embedSrc ? (
                                                        <iframe
                                                            src={embedSrc}
                                                            className="aspect-video w-full"
                                                            title="Video"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <img
                                                            src={mediaUrl}
                                                            alt=""
                                                            className="aspect-video w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })()}
                                </div>
                            </div>
                        </section>
                    )}

                {firstImage && (
                    <Image
                        src={firstImage}
                        alt="Product"
                        className="landing-width mb-4 rounded-xl shadow-md max-md:w-full lg:px-4"
                        width={1000}
                        height={1000}
                    />
                )}

                {/* Benefits / Features Section */}
                {featuresSection && featuresSection.sectionList && featuresSection.sectionList.length > 0 && (
                    <section className="bg-white py-12">
                        <div className="container mx-auto max-w-4xl px-6">
                            <div className="mb-10 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                                    {featuresSection.title || "পণ্যের বিশেষত্ব ও সুবিধা"}
                                </h2>
                                <div className="mx-auto mt-4 h-1 w-20 bg-[var(--theme-primary)]"></div>
                            </div>
                            <div className="grid gap-6 md:grid-cols-3">
                                {featuresSection.sectionList.map((feature, index) => (
                                    <div
                                        key={feature.id ?? index}
                                        className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm"
                                    >
                                        <div className="mb-3 text-xl font-bold text-[var(--theme-primary)]">
                                            #{toBengaliNumber(index + 1)}
                                        </div>
                                        <h4 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h4>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {secondImage && (
                    <Image
                        src={secondImage}
                        alt="Product"
                        className="landing-width mb-4 rounded-xl shadow-md max-md:w-full"
                        width={1000}
                        height={1000}
                    />
                )}

                {/* Customer Review / Testimonials Section */}
                {testimonialsSection && <Testimonials section={testimonialsSection} />}

                {product.videoLink && !aboutSection && (
                    <div className="px-6">
                        <ProductVideo videoLink={product.videoLink} />
                    </div>
                )}

                {/* FAQ Section */}
                {faqSection && <FAQ02 section={faqSection} />}

                {otherImages && otherImages.length > 0 && (
                    <div className="landing-width py-12">
                        <h2 className="mb-6 text-center text-2xl font-bold text-[var(--theme-primary)] md:text-3xl lg:mb-8">
                            আমাদের পণ্যের কোয়ালিটি
                        </h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            {otherImages.map((image) => (
                                <Image
                                    src={image}
                                    alt="Product"
                                    className="w-full rounded-xl shadow-md"
                                    width={1000}
                                    height={1000}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Important Points Section */}
                <section className="bg-gradient-to-br from-[var(--theme-secondary)] to-white px-6 py-12">
                    <div className="landing-width rounded-2xl border-2 border-[var(--theme-primary)] bg-white p-6 shadow-2xl md:p-10">
                        {/* Title */}
                        <h2 className="mb-6 text-center text-2xl font-bold text-[var(--theme-primary)] md:text-3xl">
                            ২ টি গুরুত্বপূর্ণ বিষয়
                        </h2>

                        {/* Checkpoints */}
                        <div className="mb-8 space-y-6">
                            {importantPoints.map((point) => (
                                <div
                                    key={point.title}
                                    className="flex items-start gap-4 rounded-xl border-[var(--theme-secondary)] transition-all"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--theme-primary)]">
                                            <svg
                                                className="h-5 w-5 text-white"
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
                                        </div>
                                    </div>
                                    <p className="flex-1 text-base leading-relaxed text-gray-800 md:text-lg">
                                        {point.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {contactSection && (
                            <div className="text-center">
                                <a
                                    href={`tel:${ensureCountryCode(contactSection.title ?? "")}`}
                                    className="group inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--theme-primary)] px-6 py-2 text-xl font-bold text-white transition-all md:px-10 md:py-4 md:text-xl"
                                >
                                    <Phone className="h-6 w-6" />
                                    <span>
                                        <span className="max-sm:hidden">যে কোনো প্রয়োজনে কল করুন:</span>{" "}
                                        {contactSection.title}
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>
                </section>

                {/* Order Section */}
                <OrderSection
                    theme={{ primary: theme.primary, secondary: theme.secondary }}
                    product={product}
                    packages={packages}
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

                {/* Featured Products */}
                <FeaturedProducts featureProducts={featureProducts} shopSlug={shopSlug} />

                {/* Footer */}
                <ProductFooter banglaName={product.banglaName} shopSlug={shopSlug} />
            </>
        </div>
    );
};
