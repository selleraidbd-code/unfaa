"use client";

import Image from "next/image";

import { useShop } from "@/contexts/shop-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export const HeroSection = () => {
    const { shopTheme } = useShop();
    const bannerImg = shopTheme?.bannerImg || [];

    // If there's only one image, render it without the slider
    if (bannerImg.length === 1) {
        return (
            <section className="container w-full pb-16">
                <div className="relative h-auto w-full">
                    <Image
                        unoptimized
                        src={bannerImg[0] || "/placeholder.svg"}
                        alt="Banner"
                        className="h-auto w-full object-cover"
                        width={1000}
                        height={500}
                    />
                </div>
            </section>
        );
    }

    // If there are multiple images, use the slider
    return (
        <section className="container h-fit w-full pb-16">
            <div className="group relative">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={{
                        nextEl: `.swiper-button-custom-next`,
                        prevEl: `.swiper-button-custom-prev`,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="overflow-hidden"
                >
                    {bannerImg?.map((slide, index) => (
                        <SwiperSlide key={`${slide}-${index}`}>
                            {/* <div className="relative h-auto w-full"> */}
                            <Image
                                unoptimized
                                src={slide || "/placeholder.svg"}
                                alt={`Banner ${index + 1}`}
                                className="h-auto w-full object-cover"
                                width={1000}
                                height={400}
                            />
                            {/* </div> */}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation buttons - only visible on hover */}
                <button
                    type="button"
                    className="swiper-button-custom-prev disabled:bg-muted disabled:text-muted-foreground bg-primary/80 hover:bg-primary absolute top-1/2 left-4 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="size-5" />
                </button>
                <button
                    type="button"
                    className="swiper-button-custom-next bg-primary/80 hover:bg-primary absolute top-1/2 right-4 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
                    aria-label="Next slide"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </section>
    );
};
