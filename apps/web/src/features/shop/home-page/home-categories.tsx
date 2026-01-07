"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ShopThemeCategory } from "@/types/shop-type";
import { getLink } from "@/lib/get-link";

export const HomeCategories = ({ categories, shopSlug }: { categories: ShopThemeCategory[]; shopSlug: string }) => {
    const showSlider = categories.length > 8;
    const uniqueId = "categories";

    return (
        <section className="relative container pb-8 sm:pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="flex items-center gap-1.5">
                        <span className="bg-primary h-6 w-1.5 rounded-sm"></span>{" "}
                        <span className="text-lg">Categories</span>
                    </p>
                    <h2 className="title mt-2">Browse By Category</h2>
                </div>

                {/* Navigation Arrows - Only show when slider is active */}
                {showSlider && (
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
                )}
            </div>

            {/* Categories Grid or Slider */}
            {showSlider ? (
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={2}
                    navigation={{
                        nextEl: `.swiper-button-custom-next-${uniqueId}`,
                        prevEl: `.swiper-button-custom-prev-${uniqueId}`,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 16 },
                        768: { slidesPerView: 4, spaceBetween: 24 },
                        1024: { slidesPerView: 6, spaceBetween: 24 },
                        1280: { slidesPerView: 8, spaceBetween: 24 },
                    }}
                    className="category-slider"
                >
                    {categories.length === 0 ? (
                        // Show error state
                        <SwiperSlide>
                            <div className="py-12 text-center">
                                <div className="mb-4 text-red-500">
                                    <svg
                                        className="mx-auto mb-4 h-16 w-16"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                    <p className="text-lg font-medium">No categories found</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ) : (
                        categories.map((category) => (
                            <SwiperSlide key={category.id} className="h-auto">
                                <Link
                                    href={getLink({
                                        shopSlug,
                                        path: `/category/${category.categoryId}`,
                                    })}
                                    className="group mt-8 block cursor-pointer rounded-md border-1 pb-4"
                                >
                                    <Image
                                        alt="category image"
                                        src={category?.category.thumbnailImg || "/placeholder.png"}
                                        width={150}
                                        height={150}
                                        className="mx-auto mt-5 flex h-auto w-[50%] items-center justify-center object-cover duration-300 group-hover:scale-110 group-hover:transition-all"
                                    />

                                    <h3 className="text-muted-foreground group-hover:text-primary mt-4 text-center text-sm transition-colors duration-300">
                                        {category.category.name}
                                    </h3>
                                </Link>
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-6 xl:grid-cols-8">
                    {categories.length === 0 ? (
                        // Show error state
                        <div className="col-span-full py-12 text-center">
                            <div className="mb-4 text-red-500">
                                <svg
                                    className="mx-auto mb-4 h-16 w-16"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                                <p className="text-lg font-medium">No categories found</p>
                            </div>
                            <button className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                    <span>Retrying...</span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <Link
                                href={getLink({
                                    shopSlug,
                                    path: `/category/${category.categoryId}`,
                                })}
                                key={category.id}
                                className="group cursor-pointer rounded-md border-1 pt-2"
                            >
                                <Image
                                    alt="category image"
                                    src={category?.category.thumbnailImg || "/placeholder.png"}
                                    width={100}
                                    height={100}
                                    className="mx-auto flex h-[80px] w-[80px] items-center justify-center object-cover duration-300 group-hover:scale-110 group-hover:transition-all"
                                />

                                <h3 className="text-muted-foreground group-hover:text-primary my-1 text-center text-sm transition-colors duration-300">
                                    {category.category.name}
                                </h3>
                            </Link>
                        ))
                    )}
                </div>
            )}

            {/* Loading indicator */}
            {categories.length === 0 && (
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-purple-600"></div>
                        <span className="text-sm">Loading categories...</span>
                    </div>
                </div>
            )}
        </section>
    );
};
