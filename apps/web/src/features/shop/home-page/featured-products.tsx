"use client";

import { ProductCard } from "@/features/shop/home-page/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ShopSectionProduct } from "@/types/shop-type";

interface FeaturedProductsProps {
    subtitle: string;
    title: string;
    uniqueId: string;
    products: ShopSectionProduct[];
    shopSlug: string;
}

export const FeaturedProducts = ({ subtitle, title, uniqueId, products, shopSlug }: FeaturedProductsProps) => {
    return (
        <section className="relative container pb-16">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="flex items-center gap-1.5">
                        <span className="bg-primary h-6 w-1.5 rounded-sm"></span>{" "}
                        <span className="text-lg">{subtitle}</span>
                    </p>
                    <h2 className="title mt-2">{title}</h2>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className={`swiper-button-custom-prev-${uniqueId} disabled:bg-muted disabled:text-muted-foreground bg-primary hover:bg-primary/90 text-primary-foreground flex size-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-100`}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <button
                        className={`swiper-button-custom-next-${uniqueId} disabled:bg-muted disabled:text-muted-foreground bg-primary hover:bg-primary/90 text-primary-foreground flex size-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-100`}
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
                    nextEl: `.swiper-button-custom-next-${uniqueId}`,
                    prevEl: `.swiper-button-custom-prev-${uniqueId}`,
                }}
                breakpoints={{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                    1500: { slidesPerView: 5 },
                }}
                className="product-slider"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product.product} shopSlug={shopSlug} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
