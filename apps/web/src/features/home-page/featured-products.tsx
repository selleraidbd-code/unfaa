"use client";

import product1 from "@/assets/images/products/product1.webp";
import product2 from "@/assets/images/products/product2.webp";
import product3 from "@/assets/images/products/product3.webp";
import { ProductCard } from "@/features/home-page/product-card";
import { Product } from "@/types/product-type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const featuredProducts: Product[] = [
    {
        id: "fp1",
        name: "Premium Basmati Rice – 5 kg",
        category: "Grocery & Staples",
        price: 850,
        originalPrice: 950,
        discount: 10,
        image: product1,
    },
    {
        id: "fp2",
        name: "Organic Coconut Oil – 500ml",
        category: "Organic & Health Foods",
        price: 320,
        originalPrice: 380,
        discount: 15,
        image: product2,
    },
    {
        id: "fp3",
        name: "Fresh Mango Juice – 1 Liter",
        category: "Beverages",
        price: 220,
        originalPrice: 250,
        discount: 12,
        image: product3,
    },
    {
        id: "fp4",
        name: "Premium Cashew Nuts – 250g",
        category: "Snacks & Packaged Foods",
        price: 450,
        originalPrice: 500,
        discount: 10,
        image: product1,
    },
    {
        id: "fp5",
        name: "Organic Quinoa – 500g",
        category: "Organic & Health Foods",
        price: 680,
        originalPrice: 750,
        discount: 9,
        image: product2,
    },
    {
        id: "fp6",
        name: "Organic Coconut Oil – 500ml",
        category: "Organic & Health Foods",
        price: 320,
        originalPrice: 380,
        discount: 15,
        image: product2,
    },
    {
        id: "fp7",
        name: "Fresh Mango Juice – 1 Liter",
        category: "Beverages",
        price: 220,
        originalPrice: 250,
        discount: 12,
        image: product3,
    },
    {
        id: "fp8",
        name: "Premium Cashew Nuts – 250g",
        category: "Snacks & Packaged Foods",
        price: 450,
        originalPrice: 500,
        discount: 10,
        image: product1,
    },
    {
        id: "fp9",
        name: "Organic Quinoa – 500g",
        category: "Organic & Health Foods",
        price: 680,
        originalPrice: 750,
        discount: 9,
        image: product2,
    },
];

interface FeaturedProductsProps {
    subtitle: string;
    title: string;
}

export const FeaturedProducts = ({
    subtitle,
    title,
}: FeaturedProductsProps) => {
    return (
        <section className="pb-16 container relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="flex items-center gap-1.5">
                        <span className="w-1.5 h-6 bg-primary rounded-sm"></span>{" "}
                        <span className="text-lg">{subtitle}</span>
                    </p>
                    <h2 className="title mt-2">{title}</h2>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="swiper-button-custom-prev size-12 rounded-full cursor-pointer disabled:bg-gray-400  bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors duration-100"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <button
                        className="swiper-button-custom-next size-12 rounded-full cursor-pointer disabled:bg-gray-400 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors duration-100"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                navigation={{
                    nextEl: ".swiper-button-custom-next",
                    prevEl: ".swiper-button-custom-prev",
                }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                    1500: { slidesPerView: 5 },
                }}
                className="product-slider"
            >
                {featuredProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
