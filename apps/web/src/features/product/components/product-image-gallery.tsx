"use client";

import { memo, useState } from "react";

import { ChevronLeft, ChevronRight, Package } from "lucide-react";

type Props = {
    images: string[];
    productName: string;
    discountPercent?: number;
};

export const ProductImageGallery = memo(function ProductImageGallery({ images, productName, discountPercent }: Props) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100">
            {images[0] ? (
                <>
                    <img src={images[currentImageIndex]} alt={productName} className="h-full w-full object-contain" />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`h-2 w-2 rounded-full transition ${
                                            idx === currentImageIndex ? "w-6 bg-green-600" : "bg-white/60"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Package className="h-24 w-24 text-gray-300" />
                </div>
            )}

            {discountPercent !== undefined && discountPercent > 0 && (
                <div className="absolute top-4 right-4 rounded-full bg-red-600 px-3 py-2 font-bold text-white shadow-lg">
                    {discountPercent}% ছাড়
                </div>
            )}
        </div>
    );
});
