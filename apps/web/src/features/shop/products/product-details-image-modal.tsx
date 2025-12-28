"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@workspace/ui/components/button";
import { Maximize2, X } from "lucide-react";

export const ProductDetailsImageModal = ({
    allImages,
    selectedImage,
}: {
    allImages: string[];
    selectedImage?: string;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {/* Main Product Image with Expand Button */}
            <div className="group relative cursor-pointer">
                <Image
                    src={selectedImage ?? ""}
                    alt="Selected Product"
                    width={600}
                    height={600}
                    className="aspect-square w-full rounded-lg object-cover"
                />
                {/* Expand Icon Overlay */}
                <div
                    onClick={openModal}
                    className="bg-primary absolute top-4 right-4 rounded-full p-4 text-white opacity-80 transition-opacity group-hover:opacity-100"
                >
                    <Maximize2 size={20} />
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Background Overlay */}
                    <div
                        className="bg-opacity-10 absolute inset-0 bg-gray-500/10 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 mx-4 max-h-[90vh] max-w-6xl">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 right-0 z-20 rounded-full bg-gray-400 text-white hover:bg-white/20"
                            onClick={closeModal}
                        >
                            <X size={24} />
                        </Button>

                        {/* Full Size Image */}
                        <img
                            src={selectedImage ?? "/products/water-drop-bb-cream.png"}
                            alt="Water Drop BB Foundation - Lightweight & Non-Greasy with SPF 15"
                            className="h-auto max-h-[80vh] w-full rounded-lg object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
