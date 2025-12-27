/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import { useUpdateCoreThemeMutation } from "@/redux/api/shop-theme-api";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/sonner";

import { UploadCropImage } from "@/components/file-upload/upload-crop-image";

export const UploadBannerDialog = ({ bannerImg, themeId }: { bannerImg: string[]; themeId: string }) => {
    const [updateCoreTheme, { isLoading: isUpdating }] = useUpdateCoreThemeMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleBannerUpload = async (url: string) => {
        try {
            await updateCoreTheme({
                id: themeId,
                payload: {
                    bannerImg: [...bannerImg, url],
                },
            })
                .unwrap()
                .then(() => {
                    toast.success("Banner uploaded successfully");
                    setIsDialogOpen(false);
                })
                .catch((error) => {
                    toast.error(error.data?.message || "Failed to save banner");
                });
        } catch (error) {
            console.error(error);
            toast.error("Banner upload failed");
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button disabled={bannerImg.length >= 5}>Upload Banner</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add Home Page Banner</DialogTitle>
                    <DialogDescription>
                        Upload and crop your banner image. Recommended aspect ratio is{" "}
                        <strong className="text-primary">40:13</strong> (e.g., 1600x520 pixels).
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <UploadCropImage
                        onImageUpload={handleBannerUpload}
                        aspectRatio={40 / 13}
                        aspectRatioText="40:13"
                        label="Banner Image"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
