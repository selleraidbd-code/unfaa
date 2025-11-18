"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { UploadCropImage } from "./upload-crop-image";

interface PhotoGridUploadProps {
    photoURL: string;
    images: string[];
    onPhotoURLChange: (url: string) => void;
    onImagesChange: (images: string[]) => void;
}

export const PhotoGridUpload = ({
    photoURL,
    images,
    onPhotoURLChange,
    onImagesChange,
}: PhotoGridUploadProps) => {
    const handleImageUpload =
        (target: "photoURL" | number) => (url: string) => {
            if (target === "photoURL") {
                onPhotoURLChange(url);
            } else {
                const newImages = [...images];
                newImages[target] = url;
                onImagesChange(newImages);
            }
        };

    const handleDelete = (target: "photoURL" | number) => {
        if (target === "photoURL") {
            onPhotoURLChange("");
        } else {
            const newImages = [...images];
            newImages[target] = "";
            onImagesChange(newImages);
        }
    };

    // Check which images can be shown
    const canShowAllPhotos = (index: number) => {
        if (index === 0) return !!photoURL; // First additional photo needs photoURL
        return !!images[index - 1]; // Subsequent photos need previous photo
    };

    return (
        <div className="grid sm:grid-cols-3 gap-2 lg:gap-4">
            {/* Main Photo - PhotoURL */}
            <PhotoUrlBox
                imageUrl={photoURL}
                label="Photo URL"
                handleDelete={handleDelete}
                target="photoURL"
                onImageUpload={handleImageUpload("photoURL")}
            />

            {/* Additional Photos - 6 images */}
            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-4 grid-rows-2">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                    const imageUrl = images[index] || "";
                    const label = `Photo ${index + 1}`;
                    const canShow = canShowAllPhotos(index);

                    return (
                        <div key={index}>
                            {canShow || imageUrl ? (
                                <PhotoUrlBox
                                    imageUrl={imageUrl}
                                    label={label}
                                    handleDelete={handleDelete}
                                    target={index}
                                    onImageUpload={handleImageUpload(index)}
                                />
                            ) : (
                                <div
                                    className={cn(
                                        "aspect-square rounded-lg border-2 border-dashed border-muted-foreground/10 bg-muted/30 flex items-center justify-center"
                                    )}
                                >
                                    <span className="text-xs text-muted-foreground/50">
                                        {label}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface PhotoUrlBoxProps {
    imageUrl: string;
    label: string;
    handleDelete: (target: "photoURL" | number) => void;
    target: "photoURL" | number;
    className?: string;
    onImageUpload: (url: string) => void;
}

const PhotoUrlBox = ({
    imageUrl,
    label,
    handleDelete,
    target,
    onImageUpload,
    className,
}: PhotoUrlBoxProps) => {
    const hasImage = !!imageUrl;

    return (
        <div
            className={cn(
                "relative rounded-lg aspect-square overflow-hidden",
                hasImage
                    ? "border-2 border-dashed border-primary/50 bg-muted"
                    : "",
                className
            )}
        >
            {hasImage ? (
                <>
                    <Image
                        src={imageUrl}
                        alt={label}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            onClick={() => handleDelete(target)}
                            variant="destructive"
                            size="icon"
                            type="button"
                            className="rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {label}
                    </div>
                </>
            ) : (
                <UploadCropImage onImageUpload={onImageUpload} />
            )}
        </div>
    );
};
