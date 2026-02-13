"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Section } from "@workspace/ui/landing/types";

type Props = {
    section: Section;
};

const DEFAULT_TITLE = "আমাদের কাস্টমার রিভিউ";

export const Testimonials = ({ section }: Props) => {
    if (!section.sectionList || section.sectionList.length === 0) {
        return null;
    }

    return (
        <section className="bg-gray-50 px-6 py-12">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
                        {section.title || DEFAULT_TITLE}
                    </h2>
                    {section.subTitle && <p className="mt-2 text-gray-600">{section.subTitle}</p>}
                </div>
                <div className="relative">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        navigation={{
                            nextEl: ".swiper-testimonials-next",
                            prevEl: ".swiper-testimonials-prev",
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="testimonials-swiper"
                    >
                        {section.sectionList.map((item, index) => (
                            <SwiperSlide key={item.id ?? index}>
                                <div className="overflow-hidden rounded-lg border-2 border-gray-100 bg-white shadow-lg">
                                    <div className="relative aspect-[3/4] w-full">
                                        {item.imgURL && (
                                            <img
                                                src={item.imgURL}
                                                alt={item.title || `Customer review ${index + 1}`}
                                                className="size-full object-cover object-top"
                                            />
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        type="button"
                        aria-label="Previous review"
                        className="swiper-testimonials-prev absolute top-1/2 left-0 z-10 flex size-10 -translate-x-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-700 shadow-md transition hover:bg-gray-50 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next review"
                        className="swiper-testimonials-next absolute top-1/2 right-0 z-10 flex size-10 translate-x-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-700 shadow-md transition hover:bg-gray-50 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};
