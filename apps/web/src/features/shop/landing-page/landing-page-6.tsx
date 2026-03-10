"use client";

import { useState } from "react";

// Static landing page data
const landingPageData = {
    title: {
        line1: "আভিজাত্যের",
        line2: "এক নতুন",
        highlight: "অধ্যায়",
    },
    subtitle: "আপনার স্টাইল হোক আপনার আত্মপ্রকাশ। সেরা ফেব্রিক আর নিখুঁত কারুকাজে তৈরি আমাদের নতুন কালেকশন।",
    price: "৳৯৯৯",
    phone: "01XXXXXXXXX",
    whatsapp: "8801XXXXXXXXX",
    messenger: "PageID",
    mainImage: "1.png",
    reviewImages: ["rev1.png", "rev2.png"],
    features: [
        {
            icon: "🧶",
            title: "সেরা ফ্যাব্রিক",
            description: "আরামদায়ক স্পর্শ।",
        },
        {
            icon: "📐",
            title: "পারফেক্ট ফিটিং",
            description: "নিখুঁত কারুকাজ।",
        },
    ],
    benefits: [
        {
            title: "কালার গ্যারান্টি",
            description: "রঙ টেকসই এবং উজ্জ্বল থাকে দীর্ঘদিন।",
            borderColor: "border-pink-800",
        },
        {
            title: "এক্সক্লুসিভ ডিজাইন",
            description: "সম্পূর্ণ ভিন্ন ও আধুনিক লুক।",
            borderColor: "border-pink-600",
        },
        {
            title: "সাশ্রয়ী মূল্য",
            description: "বাজারের সবচেয়ে ভালো ডিল।",
            borderColor: "border-pink-800",
        },
    ],
    faqs: [
        {
            question: "১. ক্যাশ অন ডেলিভারি পাওয়া যাবে?",
            answer: "জি, আপনি পণ্য হাতে পেয়ে চেক করে তারপর টাকা পরিশোধ করতে পারবেন।",
        },
        {
            question: "২. রঙ কি উঠে যাওয়ার ভয় আছে?",
            answer: "একেবারেই না। আমাদের কাপড়গুলো ১০০% কালার ফাস্টনেস টেস্ট করা।",
        },
    ],
};

export const LandingPage6 = () => {
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaqIndex(activeFaqIndex === index ? null : index);
    };

    return (
        <div className="overflow-x-hidden bg-[#fdf2f5] text-[#1e1e1e]">
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap");
                body {
                    font-family: "Hind Siliguri", sans-serif;
                }
                @keyframes button-pop {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                .animate-pop {
                    animation: button-pop 3s infinite ease-in-out;
                }
                .animate-pop-delay-1 {
                    animation: button-pop 3s infinite ease-in-out;
                    animation-delay: 1s;
                }
                .animate-pop-delay-2 {
                    animation: button-pop 3s infinite ease-in-out;
                    animation-delay: 2s;
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

            {/* Fixed Sidebar Actions */}
            <div className="fixed top-1/2 right-2.5 z-[1000] flex -translate-y-1/2 flex-col gap-3">
                <a
                    href={`https://wa.me/${landingPageData.whatsapp}`}
                    className="animate-pop flex h-[55px] w-[55px] items-center justify-center rounded-xl border border-pink-600/10 bg-white text-green-500 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-colors hover:bg-green-50"
                >
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                    </svg>
                </a>
                <a
                    href={`tel:${landingPageData.phone}`}
                    className="animate-pop-delay-1 flex h-[55px] w-[55px] items-center justify-center rounded-xl border border-pink-600/10 bg-white text-blue-600 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-colors hover:bg-blue-50"
                >
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                </a>
                <a
                    href={`https://m.me/${landingPageData.messenger}`}
                    className="animate-pop-delay-2 flex h-[55px] w-[55px] items-center justify-center rounded-xl border border-pink-600/10 bg-white text-indigo-600 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-colors hover:bg-indigo-50"
                >
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.298.474 3.443.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.393l-3.048-3.253-5.939 3.253 6.541-6.947 3.12 3.253 5.866-3.253-6.54 6.947z" />
                    </svg>
                </a>
            </div>

            {/* Header Section */}
            <header className="container mx-auto flex flex-col items-center gap-6 px-6 py-6 md:flex-row">
                <div className="order-2 w-full text-left md:order-1 md:w-1/2">
                    <h1 className="mb-4 text-3xl leading-[1.1] font-black text-pink-800 md:text-5xl">
                        {landingPageData.title.line1} <br />
                        {landingPageData.title.line2}{" "}
                        <span className="bg-pink-600 px-2 text-white">{landingPageData.title.highlight}</span>
                    </h1>
                    <p className="mb-6 max-w-sm text-base text-slate-500">{landingPageData.subtitle}</p>
                    <div
                        className="inline-block rotate-[-5deg] bg-[#1e1e1e] px-6 py-3 text-white"
                        style={{ boxShadow: "6px 6px 0px #db2777" }}
                    >
                        <span className="block text-[10px] leading-none tracking-widest uppercase opacity-70">
                            Price
                        </span>
                        <span className="text-2xl font-black">{landingPageData.price}</span>
                    </div>
                </div>

                <div className="relative order-1 w-full md:order-2 md:w-1/2">
                    <img
                        src={landingPageData.mainImage}
                        alt="Fashion Item"
                        className="mx-auto h-auto w-full max-w-sm rounded-t-full rounded-b-lg border-8 border-white shadow-xl"
                    />
                </div>
            </header>

            {/* Features Section with Diagonal Background */}
            <section
                className="my-4 py-10 text-white"
                style={{
                    clipPath: "polygon(0 2%, 100% 0, 100% 98%, 0% 100%)",
                    background: "#9d174d",
                }}
            >
                <div className="container mx-auto grid grid-cols-2 gap-4 px-6">
                    {landingPageData.features.map((feature, index) => (
                        <div
                            key={index}
                            className={`border border-white/20 bg-white/10 p-4 ${
                                index === 0
                                    ? "rounded-tr-[3rem] rounded-bl-[3rem]"
                                    : "rounded-tl-[3rem] rounded-br-[3rem]"
                            }`}
                        >
                            <span className="mb-2 block text-3xl">{feature.icon}</span>
                            <h3 className="text-lg font-bold">{feature.title}</h3>
                            <p className="text-xs text-white/70">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-6 py-10">
                <h2 className="mb-8 text-center text-2xl leading-tight font-black text-slate-900">
                    কেন আমাদের কালেকশন সেরা?
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {landingPageData.benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border-t-4 bg-white p-5 shadow-md ${benefit.borderColor}`}
                        >
                            <h4 className="mb-1 text-lg font-bold">{benefit.title}</h4>
                            <p className="text-sm text-slate-500">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Editorial Image Section */}
            <section className="px-6 py-4">
                <img
                    src={landingPageData.reviewImages[0]}
                    alt="Editorial"
                    className="mx-auto h-auto w-full max-w-2xl rounded-2xl shadow-lg"
                />
            </section>

            {/* FAQ Section */}
            <section className="bg-white py-10">
                <div className="container mx-auto max-w-xl px-6">
                    <h2 className="mb-8 text-3xl font-black text-slate-900">
                        FAQ <span className="text-pink-600">.</span>
                    </h2>
                    <div className="space-y-4">
                        {landingPageData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="cursor-pointer border-l-4 border-slate-100 p-4 transition-all hover:bg-slate-50"
                                onClick={() => toggleFaq(index)}
                            >
                                <h4 className="text-lg font-bold">{faq.question}</h4>
                                {activeFaqIndex === index && (
                                    <div className="pt-2 text-sm leading-relaxed text-slate-500">{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews Slider */}
            <section className="bg-[#fdf2f5] py-10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="mb-6 text-sm text-xl font-bold tracking-widest text-pink-800 uppercase">
                        Happy Voices
                    </h2>
                    <div className="mx-auto max-w-[280px] overflow-hidden rounded-lg border border-white bg-white p-2 shadow-xl">
                        <div className="slider-wrapper flex w-[200%]">
                            {landingPageData.reviewImages.map((image, index) => (
                                <img key={index} src={image} alt={`Review ${index + 1}`} className="w-1/2 px-1" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
