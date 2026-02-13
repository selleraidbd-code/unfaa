"use client";

import { useState } from "react";

// Static landing page data
const landingPageData = {
    badge: "Premium Collection",
    title: "আপনার জীবনযাত্রায় আধুনিকতার ছোঁয়া",
    subtitle: "সবচেয়ে কার্যকর এবং প্রিমিয়াম কোয়ালিটির নিশ্চয়তা নিয়ে আমাদের এই বিশেষ পণ্য।",
    price: "৳৯৯৯",
    priceLabel: "সেরা অফার",
    phone: "01XXXXXXXXX",
    whatsapp: "8801XXXXXXXXX",
    messenger: "YourPage",
    mainImage: "1.png",
    reviewImages: ["rev1.png", "rev2.png"],
    videoUrl: "https://www.youtube.com/embed/3Y46v1ymdfQ",
    videoTitle: "দেখুন কীভাবে কাজ করে",
    features: [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            title: "উন্নত মান",
            description: "১০০% গ্যারান্টিড কোয়ালিটি পণ্য।",
            bgColor: "bg-slate-900",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "দ্রুত ডেলিভারি",
            description: "সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি।",
            bgColor: "bg-blue-600",
        },
    ],
    benefits: [
        {
            title: "ব্যবহার করা অত্যন্ত সহজ এবং আরামদায়ক।",
            barColor: "bg-blue-600",
        },
        {
            title: "প্রিমিয়াম ডিজাইনের কারণে এটি দীর্ঘস্থায়ী হয়।",
            barColor: "bg-amber-500",
        },
        {
            title: "আপনার সময় এবং শ্রম উভয়ই বাঁচিয়ে দিবে।",
            barColor: "bg-green-500",
        },
    ],
    faqs: [
        {
            question: "১. পণ্যটির স্থায়িত্ব কেমন?",
            answer: "জি, এটি দীর্ঘস্থায়ী ব্যবহারের জন্য প্রিমিয়াম উপাদান দিয়ে তৈরি করা হয়েছে।",
        },
        {
            question: "২. ক্যাশ অন ডেলিভারি আছে?",
            answer: "জি, আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা প্রদান করি।",
        },
    ],
    reviewsTitle: "রিয়াল রিভিউ",
    faqTitle: "সাধারণ জিজ্ঞাসা",
    faqSubtitle: "সঠিক তথ্য জেনে অর্ডার করুন",
    whyTitle: "কেন এই পণ্যটি আপনার প্রয়োজন?",
    ctaButton: "এখনি অর্ডার করুন",
    ctaWhatsapp: "WHATSAPP ORDER",
};

export const LandingPage4 = () => {
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaqIndex(activeFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-white text-slate-900 font-['Hind_Siliguri',sans-serif] pb-20">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap');
                
                body {
                    font-family: 'Hind Siliguri', sans-serif;
                    background-color: #fff;
                    color: #1e293b;
                }

                /* Circular Hero Image Design */
                .hero-circle {
                    background: #f1f5f9;
                    border-radius: 0 0 50% 50% / 0 0 15% 15%;
                }

                /* Floating Badge */
                .badge-gold {
                    background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                }

                /* Feature Grid Hover */
                .feature-box:hover {
                    transform: translateY(-5px);
                    border-color: #d4af37;
                }

                /* Reviews Carousel */
                .slider-wrapper {
                    display: flex;
                    width: 200%;
                    animation: slide-loop 12s infinite ease-in-out;
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

                html {
                    scroll-behavior: smooth;
                }
            `}</style>

            {/* Hero Section */}
            <header className="hero-circle pb-12">
                <div className="container mx-auto max-w-2xl px-6 pt-10 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 uppercase tracking-widest">
                        {landingPageData.badge}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                        {landingPageData.title}
                    </h1>

                    <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-8">
                        <div className="absolute inset-0 bg-white rounded-full shadow-2xl scale-110"></div>
                        <img
                            src={landingPageData.mainImage}
                            alt="Product"
                            className="relative z-10 w-full h-full object-cover rounded-full border-4 border-white"
                        />
                        <div className="absolute bottom-4 -right-4 badge-gold text-white px-4 py-3 rounded-2xl font-bold rotate-6 z-20">
                            <p className="text-[10px] leading-none opacity-80">
                                {landingPageData.priceLabel}
                            </p>
                            <p className="text-xl">{landingPageData.price}</p>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm md:text-base max-w-sm mx-auto mb-8">
                        {landingPageData.subtitle}
                    </p>

                    <div className="flex flex-col space-y-3 px-10">
                        <a
                            href={`https://wa.me/${landingPageData.whatsapp}`}
                            className="bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl"
                        >
                            {landingPageData.ctaButton}
                        </a>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-10">
                <div className="container mx-auto max-w-xl px-6">
                    <div className="grid grid-cols-2 gap-4">
                        {landingPageData.features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-box p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all"
                            >
                                <div
                                    className={`w-10 h-10 ${feature.bgColor} text-white rounded-lg flex items-center justify-center mb-4`}
                                >
                                    {feature.icon}
                                </div>
                                <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                                <p className="text-[10px] text-slate-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-8">
                <div className="container mx-auto max-w-xl px-6">
                    <div className="bg-slate-900 rounded-[2rem] p-4 shadow-2xl overflow-hidden">
                        <h3 className="text-center text-white font-bold mb-4 text-sm opacity-80 italic">
                            {landingPageData.videoTitle}
                        </h3>
                        <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden border border-slate-700">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={landingPageData.videoUrl}
                                frameBorder="0"
                                allowFullScreen
                                title="Product Video"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Section */}
            <section className="py-10 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto max-w-xl px-6">
                    <h2 className="text-center font-bold text-xl mb-8">{landingPageData.whyTitle}</h2>
                    <div className="space-y-3">
                        {landingPageData.benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
                            >
                                <div className={`w-2 h-8 ${benefit.barColor} rounded-full`}></div>
                                <p className="text-sm font-semibold text-slate-700">{benefit.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-10 text-center">
                <h2 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-6">
                    {landingPageData.reviewsTitle}
                </h2>
                <div className="max-w-[300px] mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
                    <div className="slider-wrapper">
                        {landingPageData.reviewImages.map((image, index) => (
                            <img key={index} src={image} alt={`Feedback ${index + 1}`} className="w-1/2" />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-10 bg-white">
                <div className="container mx-auto max-w-xl px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">{landingPageData.faqTitle}</h2>
                        <p className="text-xs text-slate-400">{landingPageData.faqSubtitle}</p>
                    </div>

                    <div className="space-y-2">
                        {landingPageData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border border-slate-100 rounded-xl transition-all cursor-pointer ${
                                    activeFaqIndex === index ? "border-l-4 border-l-[#d4af37] bg-[#fafafa]" : ""
                                }`}
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="flex items-center justify-between p-4">
                                    <span className="font-bold text-sm">{faq.question}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            activeFaqIndex === index ? "rotate-180" : ""
                                        }`}
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
                                {activeFaqIndex === index && (
                                    <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-4 left-4 right-4 z-50">
                <div className="flex items-center justify-between bg-white/90 backdrop-blur-lg p-2 rounded-2xl shadow-2xl border border-slate-100">
                    <a
                        href={`tel:${landingPageData.phone}`}
                        className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                    </a>
                    <a
                        href={`https://wa.me/${landingPageData.whatsapp}`}
                        className="flex-1 mx-2 flex items-center justify-center bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-colors"
                    >
                        {landingPageData.ctaWhatsapp}
                    </a>
                    <a
                        href={`https://m.me/${landingPageData.messenger}`}
                        className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.298.474 3.443.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.393l-3.048-3.253-5.939 3.253 6.541-6.947 3.12 3.253 5.866-3.253-6.54 6.947z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-400 text-[10px] bg-white border-t border-slate-50">
                <p>© 2026 Elite Store. All Rights Reserved.</p>
            </footer>
        </div>
    );
};