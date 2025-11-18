"use client";

import { useUploadImageMutation } from "@/redux/api/media-api";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Slider } from "@workspace/ui/components/slider";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Loader, Upload, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface UploadCropImageProps {
    onImageUpload?: (url: string) => void;
    className?: string;
    label?: string;
}

export const UploadCropImage = ({
    onImageUpload,
    className,
    label,
}: UploadCropImageProps) => {
    const [uploadImage, { isLoading }] = useUploadImageMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );
    const [fileName, setFileName] = useState<string>("");

    const onCropComplete = useCallback(
        (_croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file) return;

            setFileName(file.name);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setIsModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous");
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob | null> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return null;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                "image/jpeg",
                0.95
            );
        });
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) {
            toast.error("Please select and crop an image first");
            return;
        }

        try {
            const croppedImageBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );

            if (!croppedImageBlob) {
                toast.error("Failed to crop image");
                return;
            }

            const formData = new FormData();
            formData.append(
                "image",
                croppedImageBlob,
                fileName || "cropped-image.jpg"
            );
            formData.append("type", "image");

            const res = await uploadImage(formData).unwrap();

            if (res.data?.url) {
                toast.success("Image uploaded successfully");
                if (onImageUpload) {
                    onImageUpload(res.data.url);
                }
                handleClose();
            }
        } catch (error) {
            toast.error("Image upload failed");
            console.error("Upload error:", error);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setImageSrc("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setFileName("");
    };

    return (
        <>
            <div className={cn("space-y-2 h-full w-full", className)}>
                {label && (
                    <label className="text-sm font-medium">{label}</label>
                )}
                <div
                    className="bg-muted h-full w-full flex cursor-pointer flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary hover:bg-primary/5"
                    onClick={() =>
                        document.getElementById("crop-file-input")?.click()
                    }
                >
                    <UploadCloud className="text-muted-foreground size-10" />
                    <div className="space-y-1.5 text-center">
                        <p className="text-foreground/80 text-sm font-medium">
                            Click to upload an image
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Image will be cropped to 1:1 ratio
                        </p>
                    </div>
                    <input
                        id="crop-file-input"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="hidden"
                    />
                </div>
            </div>

            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => !open && handleClose()}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Resize your image</DialogTitle>
                        <DialogDescription>
                            Adjust the crop area to select the part of the image
                            you want to keep (1:1 aspect ratio)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted">
                            {imageSrc && (
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Zoom</label>
                            <Slider
                                value={[zoom]}
                                onValueChange={(value) =>
                                    setZoom(value[0] ?? 1)
                                }
                                min={1}
                                max={3}
                                step={0.1}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={isLoading || !croppedAreaPixels}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        <span>Upload Cropped Image</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
