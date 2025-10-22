"use client";

import { ProductDetailsImageModal } from "@/features/shop/products/product-details-image-modal";
import Image from "next/image";
import { useState } from "react";

export const ProductDetailsImages = ({
    images,
    photoURL,
}: {
    images: string[];
    photoURL: string;
}) => {
    const allImages = [photoURL, ...images];
    const [selectedImage, setSelectedImage] = useState(allImages[0]);

    return (
        <div className="h-fit space-y-6">
            <ProductDetailsImageModal
                allImages={allImages}
                selectedImage={selectedImage}
            />

            <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        alt={`Product thumbnail ${index + 1}`}
                        width={90}
                        height={90}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square border hover:ring-1 hover:ring-primary cursor-pointer rounded-sm object-cover transition ring-offset-2 ${
                            selectedImage === img
                                ? "ring-1 ring-primary"
                                : "ring-1 ring-transparent"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
