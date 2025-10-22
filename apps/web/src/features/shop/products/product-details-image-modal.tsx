"use client";

import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

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

            <div className="relative cursor-pointer group">
                <Image
                    src={selectedImage ?? ""}
                    alt="Selected Product"
                    width={400}
                    height={400}
                    className="aspect-square w-full rounded-lg object-cover"
                />
                {/* Expand Icon Overlay */}
                <div
                    onClick={openModal}
                    className="absolute top-4 right-4 bg-purple-600 text-white p-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                >
                    <Maximize2 size={20} />
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 bg-gray-500/10 bg-opacity-10 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 max-w-6xl max-h-[90vh] mx-4">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 bg-gray-400 rounded-full right-0 text-white hover:bg-white/20 z-20"
                            onClick={closeModal}
                        >
                            <X size={24} />
                        </Button>

                        {/* Full Size Image */}
                        <img
                            src={
                                selectedImage ??
                                "/products/water-drop-bb-cream.png"
                            }
                            alt="Water Drop BB Foundation - Lightweight & Non-Greasy with SPF 15"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
