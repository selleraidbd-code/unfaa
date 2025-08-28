"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

export const HeroSection = ({ bannerImg }: { bannerImg?: string[] }) => {
    return (
        <section className="w-full pb-16 container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="hero-swiper"
            >
                {bannerImg?.map((slide) => (
                    <SwiperSlide key={slide}>
                        <div className="relative w-full h-[400px] md:h-[500px]">
                            <Image
                                unoptimized
                                src={slide || "/placeholder.svg"}
                                alt={slide}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
