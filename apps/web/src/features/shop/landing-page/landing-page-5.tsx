"use client";

import { useState } from "react";

// Static landing page data
const landingPageData = {
    hero: {
        title: "আভিজাত্যের নিমিষেই রা",
        subtitle: "আপনার স্টাইল হোক আপনার আত্মপ্রকাশ। সেরা ফেব্রিক আর নিখুঁত কারুকাজে তৈরি আমাদের নতুন কালেকশন।",
        ctaText: "অর্ডার করুন",
        videoThumbnail: "/video-thumb.jpg",
        phone: "01974-536276",
    },
    features: {
        title: "আভিজাত্যের রা সম্পর্কে সেরা সুবিধা পাবেন:",
        items: [
            "১০০% ৪৪ ও ৪৬সাইজের",
            "প্রতিটি সাইজের জন্য বিভিন্ন মাপ",
            "সিলিকন ওয়্যারলেস ব্রা এবং বি কাপ সুবিধা পাবেন",
            "সম্পূর্ণ সেট",
            "পণ্যটি এক মাসের মধ্যে ডেলিভারি হয়ে যাবে নিশ্চয়তা পাবেন",
            "সব ধরনের সাইজ পাবেন (৩২, ৩৪, ৩৬, ৩৮, ৪০, ৪২, ৪৪, ৪৬)",
            "প্রতিটি ব্রা ৩০০ টাকায় পাবেন",
            "প্রতিটি সাইজের জন্য বিভিন্ন মাপ পাবেন",
            "৩৬, ৩৮, ৪০, ৪২, ৪৪, ৪৬, ৪৮, ৫০, ৫২, ৫৪, ৫৬, ৫৮",
            "প্রতিটি সাইজের জন্য বিভিন্ন মাপ",
            "৩৬, ৩৮, ৪০, ৪২, ৪৪, ৪৬, ৪৮, ৫০, ৫২, ৫৪, ৫৬, ৫৮",
            "সম্পূর্ণ সেট",
            "পণ্যটি এক মাসের মধ্যে ডেলিভারি হয়ে যাবে",
            "সব ধরনের সাইজ পাবেন (৩২, ৩৪, ৩৬, ৩৮, ৪০, ৪২, ৪৪, ৪৬)",
            "প্রতিটি ব্রা ৩০০ টাকায় পাবেন",
            "৩৬সাইজের, ৩৮সাইজের, ৪০সাইজের, ৪২সাইজের, ৪৪সাইজের, ৪৬সাইজের",
        ],
        image: "/features-image.jpg",
    },
    pricing: {
        text: "পণ্যটি হাতে পেয়ে টাকা দিবেন।",
        highlight: "মাত্র ৩০০০ টাকা",
        deliveryNote: "ডেলিভারি চার্জ সহ মোট ৩০০০/৩৫০০ টাকা",
    },
    whyBuy: {
        title: "আমাদের কাছ থেকে কেন নিবেন?",
        image: "/why-buy.jpg",
        reasons: [
            "১০০% ক্যাশ অন ডেলিভারি সুবিধা",
            "পণ্য হাতে পেয়ে চেক করে তারপর টাকা দিতে পারবেন",
            "সারা বাংলাদেশে হোম ডেলিভারি সুবিধা",
            "পণ্য হাতে পেতে ১ থেকে ৩ দিন সময় লাগবে",
        ],
    },
    productImages: {
        title: "আমাদের সেরা কোয়ালিটি",
        images: ["/product1.jpg", "/product2.jpg", "/product3.jpg"],
    },
    reviews: {
        title: "আমাদের কাস্টমার রিভিউ",
        images: ["/review1.jpg", "/review2.jpg", "/review3.jpg"],
    },
    orderForm: {
        title: "অর্ডার করুন",
        deliveryInfo: "২ টি পণ্যসহ ডেলিভারি",
        fields: {
            name: "আপনার নাম এবং ঠিকানা লিখুন",
            phone: "আপনার মোবাইল নাম্বার লিখুন",
        },
        submitText: "এখনি অর্ডার করুন 01974-536276",
    },
};

export const LandingPage5 = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
    };

    return (
        <div className="bg-white text-gray-800">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap');
                body {
                    font-family: 'Hind Siliguri', sans-serif;
                }
                html {
                    scroll-behavior: smooth;
                }
            `}</style>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        {landingPageData.hero.title}
                    </h1>
                    <p className="text-sm md:text-base mb-4 max-w-2xl mx-auto">
                        {landingPageData.hero.subtitle}
                    </p>
                    <a
                        href="#order"
                        className="inline-block bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors"
                    >
                        {landingPageData.hero.ctaText}
                    </a>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-8 px-4 bg-gray-50">
                <div className="container mx-auto max-w-3xl">
                    <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                        <div className="aspect-video">
                            <img
                                src={landingPageData.hero.videoThumbnail}
                                alt="Product Video"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-pink-600 ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <a
                            href={`tel:${landingPageData.hero.phone}`}
                            className="inline-block bg-green-500 text-white font-bold px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
                        >
                            Call us: {landingPageData.hero.phone}
                        </a>
                    </div>
                    <div className="text-center mt-4">
                        <a
                            href="#order"
                            className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-8 py-3 rounded-full hover:from-red-600 hover:to-pink-600 transition-colors"
                        >
                            {landingPageData.hero.ctaText}
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                    <h2 className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl md:text-3xl font-bold text-center py-4 mb-8">
                        {landingPageData.features.title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
                        <div className="space-y-3">
                            {landingPageData.features.items.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="text-pink-600 mt-1 flex-shrink-0">✓</span>
                                    <p className="text-sm md:text-base">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <img
                                src={landingPageData.features.image}
                                alt="Product Features"
                                className="rounded-2xl shadow-lg max-w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-8 px-4 bg-gray-50">
                <div className="container mx-auto max-w-2xl text-center">
                    <div className="bg-white border-2 border-pink-500 rounded-2xl p-6 shadow-lg">
                        <p className="text-lg mb-2">{landingPageData.pricing.text}</p>
                        <p className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                            {landingPageData.pricing.highlight}
                        </p>
                        <p className="text-sm text-gray-600">
                            {landingPageData.pricing.deliveryNote}
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Buy Section */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl md:text-3xl font-bold text-center py-4 mb-8">
                        {landingPageData.whyBuy.title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="flex justify-center order-2 md:order-1">
                            <img
                                src={landingPageData.whyBuy.image}
                                alt="Why Buy"
                                className="rounded-2xl shadow-lg max-w-full"
                            />
                        </div>
                        <div className="space-y-4 order-1 md:order-2">
                            {landingPageData.whyBuy.reasons.map((reason, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="text-pink-600 text-xl flex-shrink-0">✓</span>
                                    <p className="text-base md:text-lg font-semibold">{reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Images Section */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl md:text-3xl font-bold text-center py-4 mb-8">
                        {landingPageData.productImages.title}
                    </h2>
                    <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {landingPageData.productImages.images.map((image, index) => (
                            <div key={index} className="aspect-square">
                                <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover rounded-xl shadow-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                    <h2 className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl md:text-3xl font-bold text-center py-4 mb-8">
                        {landingPageData.reviews.title}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                        {landingPageData.reviews.images.map((image, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <img
                                    src={image}
                                    alt={`Review ${index + 1}`}
                                    className="w-full h-auto"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Order Form Section */}
            <section id="order" className="py-12 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="container mx-auto max-w-2xl">
                    <h2 className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-2xl md:text-3xl font-bold text-center py-4 mb-2 rounded-t-2xl">
                        {landingPageData.orderForm.title}
                    </h2>
                    <div className="bg-white rounded-b-2xl shadow-2xl p-6 md:p-8">
                        <p className="text-center text-lg font-semibold mb-6 text-pink-600">
                            {landingPageData.orderForm.deliveryInfo}
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder={landingPageData.orderForm.fields.name}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    placeholder={landingPageData.orderForm.fields.phone}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors text-lg"
                            >
                                {landingPageData.orderForm.submitText}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Fixed WhatsApp Button */}
            <a
                href={`https://wa.me/${landingPageData.hero.phone.replace(/[^0-9]/g, "")}`}
                className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-50"
            >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049a11.802 11.802 0 001.608 6.008L0 24l6.102-1.6a11.777 11.777 0 005.943 1.648h.005c6.635 0 12.046-5.412 12.049-12.05a11.776 11.776 0 00-3.541-8.517z" />
                </svg>
            </a>
        </div>
    );
};