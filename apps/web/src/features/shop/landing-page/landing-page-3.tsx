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
    whyUs: [
        "১০০% ক্যাশ অন ডেলিভারি সুবিধা",
        "পণ্য হাতে পেয়ে চেক করার সুযোগ",
        "২৪ ঘণ্টা কাস্টমার সাপোর্ট",
    ],
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

export const LandingPage3 = () => {
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaqIndex(activeFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-white text-slate-600 pb-20">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap');
                body {
                    font-family: 'Hind Siliguri', sans-serif;
                }
                .bg-soft-gradient {
                    background: radial-gradient(
                        circle at 10% 20%,
                        rgba(243, 244, 255, 1) 0%,
                        rgba(255, 255, 255, 1) 90%
                    );
                }
                @keyframes slide-loop {
                    0%, 45% {
                        transform: translateX(0);
                    }
                    50%, 95% {
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
            <div className="fixed right-[15px] top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-3">
                <a
                    href={`tel:${landingPageData.phone}`}
                    className="w-[45px] h-[45px] flex items-center justify-center rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:scale-110 bg-white text-blue-600"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                </a>
                <a
                    href={`https://wa.me/${landingPageData.whatsapp}`}
                    className="w-[45px] h-[45px] flex items-center justify-center rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:scale-110 bg-white text-green-500"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                    </svg>
                </a>
            </div>

            {/* Header Section */}
            <header className="pt-8 pb-10 overflow-hidden bg-soft-gradient">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-left">
                        <div className="inline-flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full mb-4">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                                {landingPageData.badge}
                            </p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-4">
                            {landingPageData.title.line1} <br />
                            <span className="text-indigo-600">{landingPageData.title.line2}</span>{" "}
                            {landingPageData.title.line3}
                        </h1>
                        <p className="text-lg text-slate-500 mb-6 max-w-md">
                            {landingPageData.subtitle}
                        </p>

                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase">অফার মূল্য</p>
                                <p className="text-2xl font-black text-indigo-600">
                                    {landingPageData.price}
                                </p>
                            </div>
                            <a
                                href="#buy"
                                className="flex-1 text-center bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all"
                            >
                                এখনি অর্ডার দিন
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
                        <img
                            src={landingPageData.mainImage}
                            alt="Hero"
                            className="relative z-10 w-full max-w-sm mx-auto rounded-[2.5rem] shadow-2xl"
                        />
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-12 bg-slate-900 text-white rounded-t-[3rem]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <div className="max-w-md">
                            <h2 className="text-3xl font-bold mb-2">সেরা কেন বলবেন?</h2>
                            <p className="text-slate-400">
                                প্রতিটি খুঁটিনাটি বিষয়ের উপর নজর দিয়ে তৈরি করা হয়েছে এই পণ্যটি।
                            </p>
                        </div>
                        <div className="w-10 h-10 border-2 border-indigo-500 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-indigo-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {landingPageData.features.map((feature, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-[2rem] ${
                                    feature.variant === "dark"
                                        ? "bg-slate-800 border border-slate-700"
                                        : "bg-indigo-600 shadow-2xl shadow-indigo-500/20"
                                }`}
                            >
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                                <p
                                    className={`text-sm leading-relaxed ${
                                        feature.variant === "dark"
                                            ? "text-slate-400"
                                            : "text-indigo-100"
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
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="relative group text-center">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800">
                            ভিডিওতে বিস্তারিত দেখুন
                        </h2>
                        <div className="relative bg-white rounded-[2rem] p-3 border border-slate-100 shadow-2xl">
                            <div className="aspect-video rounded-[1.5rem] overflow-hidden">
                                <iframe
                                    className="w-full h-full"
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
            <section className="py-12 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-8">হাজারো সন্তুষ্ট কাস্টমার</h2>
                    <div className="max-w-[320px] mx-auto shadow-2xl rounded-[2.5rem] border-4 border-white overflow-hidden">
                        <div className="flex w-[200%] slider-wrapper">
                            {landingPageData.reviewImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Review ${index + 1}`}
                                    className="w-1/2"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto max-w-2xl px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">কিছু প্রশ্ন ও উত্তর</h2>
                    <div className="space-y-2">
                        {landingPageData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="p-4 cursor-pointer border-b border-slate-200"
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-lg">{faq.question}</h4>
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
                                    <p className="pt-3 text-slate-500 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-12 bg-indigo-50/50">
                <div className="container mx-auto max-w-xl px-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-100">
                        <h3 className="text-2xl font-bold mb-6 text-center text-indigo-900">
                            কেন আমাদের থেকে নিবেন?
                        </h3>
                        <div className="space-y-4">
                            {landingPageData.whyUs.map((reason, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">
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
                className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-3 z-[100]"
            >
                <div className="container mx-auto max-w-2xl flex items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <a
                            href={`tel:${landingPageData.phone}`}
                            className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 md:hidden"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </a>
                        <a
                            href={`https://wa.me/${landingPageData.whatsapp}`}
                            className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                            </svg>
                        </a>
                    </div>
                    <a
                        href={`https://wa.me/${landingPageData.whatsapp}`}
                        className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-center shadow-lg"
                    >
                        এখনি অর্ডার করুন
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-10 bg-slate-50 text-center text-slate-400 text-xs">
                <p>© 2026 Your Premium Store. All Rights Reserved.</p>
            </footer>
        </div>
    );
};
