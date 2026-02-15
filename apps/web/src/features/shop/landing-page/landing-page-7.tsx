"use client";

import { useState } from "react";

// Static landing page data
const landingPageData = {
    badge: "Special Edition 2026",
    title: {
        line1: "একদম নতুন",
        line2: "টেকনোলজিতে",
        line3: "আপনার জীবন হোক সহজ",
    },
    subtitle: "আপনার দৈনন্দিন কাজকে আরও আনন্দময় করতে আমরা নিয়ে এসেছি বাজারের সেরা প্রিমিয়াম প্রোডাক্ট।",
    price: "৳৯৯৯",
    phone: "01XXXXXXXXX",
    whatsapp: "8801XXXXXXXXX",
    mainImage: "1.png",
    reviewImages: ["rev1.png", "rev2.png"],
    videoUrl: "https://www.youtube.com/embed/3Y46v1ymdfQ",
    features: [
        {
            icon: "💎",
            title: "অতুলনীয় ফিনিশিং",
            description: "উন্নতমানের মেটেরিয়াল ব্যবহার করায় এটি দেখতে যেমন আকর্ষণীয়, স্থায়িত্বও তেমনই বেশি।",
            variant: "dark",
        },
        {
            icon: "⚡",
            title: "স্মার্ট ডিজাইন",
            description: "আধুনিক টেকনোলজি এবং ইউজার ফ্রেন্ডলি ডিজাইনের পারফেক্ট কম্বিনেশন।",
            variant: "primary",
        },
    ],
    whyUs: ["১০০% ক্যাশ অন ডেলিভারি সুবিধা", "পণ্য হাতে পেয়ে চেক করার সুযোগ", "২৪ ঘণ্টা কাস্টমার সাপোর্ট"],
    faqs: [
        {
            question: "পণ্যটি কি আসলেও দীর্ঘস্থায়ী হবে?",
            answer: "জি, আমাদের পণ্যটি হাই-গ্রেড ম্যাটেরিয়াল দিয়ে তৈরি, যা দীর্ঘদিন ব্যবহার করার নিশ্চয়তা দেয়।",
        },
        {
            question: "ঢাকার বাইরে কি হোম ডেলিভারি পাওয়া যাবে?",
            answer: "অবশ্যই! আমরা সারা বাংলাদেশে কুরিয়ারের মাধ্যমে হোম ডেলিভারি সুবিধা প্রদান করি।",
        },
    ],
};

export const LandingPage7 = () => {
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaqIndex(activeFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-white pb-20 text-slate-600">
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap");
                body {
                    font-family: "Hind Siliguri", sans-serif;
                }
                .bg-soft-gradient {
                    background: radial-gradient(
                        circle at 10% 20%,
                        rgba(243, 244, 255, 1) 0%,
                        rgba(255, 255, 255, 1) 90%
                    );
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

            {/* Sidebar Social (Desktop Only) */}
            <div className="fixed top-1/2 right-[15px] z-[100] hidden -translate-y-1/2 flex-col gap-3 md:flex">
                <a
                    href={`tel:${landingPageData.phone}`}
                    className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:scale-110"
                >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                </a>
                <a
                    href={`https://wa.me/${landingPageData.whatsapp}`}
                    className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-green-500 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:scale-110"
                >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                    </svg>
                </a>
            </div>

            {/* Header Section */}
            <header className="bg-soft-gradient overflow-hidden pt-8 pb-10">
                <div className="container mx-auto grid items-center gap-8 px-6 md:grid-cols-2">
                    <div className="text-left">
                        <div className="mb-4 inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3 py-1">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500"></span>
                            <p className="text-[10px] font-bold tracking-tighter text-indigo-600 uppercase">
                                {landingPageData.badge}
                            </p>
                        </div>
                        <h1 className="mb-4 text-4xl leading-[1.1] font-black text-slate-900 md:text-5xl">
                            {landingPageData.title.line1} <br />
                            <span className="text-indigo-600">{landingPageData.title.line2}</span>{" "}
                            {landingPageData.title.line3}
                        </h1>
                        <p className="mb-6 max-w-md text-lg text-slate-500">{landingPageData.subtitle}</p>

                        <div className="flex items-center space-x-4">
                            <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase">অফার মূল্য</p>
                                <p className="text-2xl font-black text-indigo-600">{landingPageData.price}</p>
                            </div>
                            <a
                                href="#buy"
                                className="flex-1 rounded-2xl bg-slate-900 py-4 text-center font-bold text-white shadow-2xl shadow-slate-200 transition-all hover:bg-slate-800"
                            >
                                এখনি অর্ডার দিন
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
                        <img
                            src={landingPageData.mainImage}
                            alt="Hero"
                            className="relative z-10 mx-auto w-full max-w-sm rounded-[2.5rem] shadow-2xl"
                        />
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="rounded-t-[3rem] bg-slate-900 py-12 text-white">
                <div className="container mx-auto px-6">
                    <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row">
                        <div className="max-w-md">
                            <h2 className="mb-2 text-3xl font-bold">সেরা কেন বলবেন?</h2>
                            <p className="text-slate-400">
                                প্রতিটি খুঁটিনাটি বিষয়ের উপর নজর দিয়ে তৈরি করা হয়েছে এই পণ্যটি।
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-500">
                            <svg
                                className="h-5 w-5 text-indigo-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {landingPageData.features.map((feature, index) => (
                            <div
                                key={index}
                                className={`rounded-[2rem] p-6 ${
                                    feature.variant === "dark"
                                        ? "border border-slate-700 bg-slate-800"
                                        : "bg-indigo-600 shadow-2xl shadow-indigo-500/20"
                                }`}
                            >
                                <div className="mb-4 text-3xl">{feature.icon}</div>
                                <h4 className="mb-2 text-xl font-bold">{feature.title}</h4>
                                <p
                                    className={`text-sm leading-relaxed ${
                                        feature.variant === "dark" ? "text-slate-400" : "text-indigo-100"
                                    }`}
                                >
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="bg-white py-12">
                <div className="container mx-auto max-w-3xl px-6">
                    <div className="group relative text-center">
                        <h2 className="mb-6 text-2xl font-bold text-slate-800">ভিডিওতে বিস্তারিত দেখুন</h2>
                        <div className="relative rounded-[2rem] border border-slate-100 bg-white p-3 shadow-2xl">
                            <div className="aspect-video overflow-hidden rounded-[1.5rem]">
                                <iframe
                                    className="h-full w-full"
                                    src={landingPageData.videoUrl}
                                    title="Product Demo"
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Slider */}
            <section className="overflow-hidden bg-slate-50 py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="mb-8 text-2xl font-bold">হাজারো সন্তুষ্ট কাস্টমার</h2>
                    <div className="mx-auto max-w-[320px] overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl">
                        <div className="slider-wrapper flex w-[200%]">
                            {landingPageData.reviewImages.map((image, index) => (
                                <img key={index} src={image} alt={`Review ${index + 1}`} className="w-1/2" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white py-12">
                <div className="container mx-auto max-w-2xl px-6">
                    <h2 className="mb-8 text-center text-3xl font-bold">কিছু প্রশ্ন ও উত্তর</h2>
                    <div className="space-y-2">
                        {landingPageData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="cursor-pointer border-b border-slate-200 p-4"
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-bold">{faq.question}</h4>
                                    <span
                                        className={`text-2xl text-indigo-600 transition-transform ${
                                            activeFaqIndex === index ? "rotate-45" : ""
                                        }`}
                                    >
                                        +
                                    </span>
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-400 ${
                                        activeFaqIndex === index ? "max-h-[150px]" : "max-h-0"
                                    }`}
                                >
                                    <p className="pt-3 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="bg-indigo-50/50 py-12">
                <div className="container mx-auto max-w-xl px-6">
                    <div className="rounded-[2.5rem] border border-indigo-100 bg-white p-8 shadow-xl">
                        <h3 className="mb-6 text-center text-2xl font-bold text-indigo-900">কেন আমাদের থেকে নিবেন?</h3>
                        <div className="space-y-4">
                            {landingPageData.whyUs.map((reason, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
                                        ✓
                                    </div>
                                    <p className="font-bold text-slate-700">{reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Fixed Bottom CTA Bar */}
            <div
                id="buy"
                className="fixed bottom-0 left-0 z-[100] w-full border-t border-slate-100 bg-white/90 px-6 py-3 backdrop-blur-xl"
            >
                <div className="container mx-auto flex max-w-2xl items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <a
                            href={`tel:${landingPageData.phone}`}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 md:hidden"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </a>
                        <a
                            href={`https://wa.me/${landingPageData.whatsapp}`}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                            </svg>
                        </a>
                    </div>
                    <a
                        href={`https://wa.me/${landingPageData.whatsapp}`}
                        className="flex-1 rounded-2xl bg-indigo-600 py-4 text-center font-bold text-white shadow-lg"
                    >
                        এখনি অর্ডার করুন
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 py-10 text-center text-xs text-slate-400">
                <p>© 2026 Your Premium Store. All Rights Reserved.</p>
            </footer>
        </div>
    );
};
