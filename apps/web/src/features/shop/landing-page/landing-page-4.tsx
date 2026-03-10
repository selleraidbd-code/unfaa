"use client";

import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/assets/icons";
import { FAQ02 } from "@/features/shop/landing-page/components/faq-2";
import { Testimonials } from "@/features/shop/landing-page/components/testimonials";
import { EasyLandingWrapper } from "@/features/shop/landing-page/easy-landing-wrapper";
import { ensureCountryCode } from "@/features/shop/landing-page/lib";
import { EComponentType } from "@workspace/ui/landing/types";

import { LandingPage as LandingPageType } from "@/types/landing-type";

const DEFAULT_DESC_LIST = [
    "নিয়ম মেনে এক মাস খেলে ইনশাল্লাহ ৬ থেকে ৮ কেজি ওজন কমে",
    "সম্পূর্ণ প্রাকৃতিক উপাদান তাই কোন পার্শ্বপ্রতিক্রিয়া নেই",
    "ডেলিভারি চার্জ সম্পূর্ণ ফ্রি অগ্রিম কোন টাকা দিতে হবে না",
    "পণ্য হাতে পেয়ে তারপরে টাকা পরিশোধ করবেন",
];

type Props = {
    landingPage: LandingPageType;
    domain: string;
};

export const LandingPage04 = ({ landingPage, domain }: Props) => {
    const product = landingPage.product;
    const sections = landingPage.section;

    const faqSection = sections?.find((s) => s.sectionType === EComponentType.FAQ);
    const contactSection = sections?.find((s) => s.sectionType === EComponentType.CTA);
    const featuresSection = sections?.find((s) => s.sectionType === EComponentType.FEATURES);
    // Find Testimonials / Customer Review section
    const testimonialsSection = sections?.find((s) => s.sectionType === EComponentType.TESTIMONIALS);

    const theme = {
        primary: contactSection?.imgURL || "#111",
        secondary: contactSection?.bgURL || "#fafafa",
    };

    const heroBgImage = product.photoURL || product.images?.[0];

    return (
        <EasyLandingWrapper
            landingPage={landingPage}
            domain={domain}
            theme={theme}
            specialNote={contactSection?.buttonText}
            className="bg-[#f2f2f2] pb-20"
        >
            {/* Hero */}
            <section className="relative w-full overflow-hidden">
                <div
                    className="absolute inset-0 z-0 scale-110 bg-cover bg-center bg-no-repeat blur-md"
                    style={{
                        backgroundImage: heroBgImage ? `url("${heroBgImage}")` : undefined,
                    }}
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/65 via-black/35 to-white/95" />
                <div className="relative z-[2] px-3 py-10 pb-14 text-center text-white sm:px-4">
                    <h1 className="mb-4 font-serif text-3xl leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:text-4xl">
                        {landingPage.name || product.banglaName || product.name}
                    </h1>
                    <div className="mx-auto mb-6 max-w-2xl px-2">
                        {heroBgImage && (
                            <Image
                                src={heroBgImage}
                                alt={product.banglaName}
                                width={400}
                                height={400}
                                className="w-full rounded-none"
                            />
                        )}
                    </div>
                    <Link
                        href={`#order-section`}
                        className="mb-2 inline-block rounded-full bg-white px-7 py-3 text-[22px] font-semibold text-black"
                    >
                        অর্ডার করুন — ৳ {product.discountPrice.toLocaleString()}
                    </Link>
                    <p className="text-[13px] text-[#222]">ক্যাশ অন ডেলিভারি সুবিধা আছে</p>
                </div>
            </section>

            {/* Customer Review / Testimonials Section */}
            {testimonialsSection && <Testimonials section={testimonialsSection} />}

            {/* FAQ Accordion */}
            {faqSection && <FAQ02 section={faqSection} />}

            {/* WhatsApp float */}
            {contactSection?.title && (
                <a
                    href={`https://wa.me/${ensureCountryCode(contactSection.title).replace("+", "")}?text=আমি ${product.banglaName} অর্ডার করতে চাই`}
                    className="fixed right-5 bottom-[95px] z-[998] flex items-center no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                >
                    <span className="mr-2 animate-[slowFade_4s_ease-in-out_infinite] rounded-[20px] bg-white px-3 py-1.5 text-xs font-semibold text-[#333] shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
                        আপনার কোন প্রশ্ন আছে?
                    </span>
                    <span className="center size-12 rounded-full bg-green-500 text-white">
                        <WhatsAppIcon className="size-7" />
                    </span>
                </a>
            )}

            {/* Floating order button - opens modal */}
            <Link
                href={"#order-section"}
                className="fixed bottom-5 left-1/2 z-[999] -translate-x-1/2 rounded-full border border-white/30 bg-white/20 px-12 py-4 text-center text-lg font-semibold whitespace-nowrap text-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-[15px] transition hover:bg-white/30 active:scale-[0.98]"
            >
                অর্ডার করুন — ৳{product.discountPrice.toLocaleString()}
            </Link>
        </EasyLandingWrapper>
    );
};
