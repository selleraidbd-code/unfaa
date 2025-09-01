/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Media } from "@/types/media-type";
import { useState, useCallback } from "react";
import { useUploadImageMutation } from "@/redux/api/media-api";
import { CloudUpload, Loader, UploadIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import { useUpdateCoreThemeMutation } from "@/redux/api/shop-theme-api";

export const UploadBannerDialog = ({
    bannerImg,
    themeId,
}: {
    bannerImg: string[];
    themeId: string;
}) => {
    const [uploadImage, { isLoading }] = useUploadImageMutation();
    const [updateCoreTheme, { isLoading: isUpdating }] =
        useUpdateCoreThemeMutation();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Clear previous selections
        setSelectedFiles(acceptedFiles);

        // Create preview URLs
        const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        onDropRejected: (rejectedFiles) => {
            rejectedFiles.forEach((rejection) => {
                const fileType = rejection.file.type;
                if (!fileType.startsWith("image/")) {
                    toast.error(
                        `Invalid file type. Please upload an image file (JPEG, JPG, PNG).`
                    );
                }
            });
        },
        accept: {
            "image/*": [],
        },
        multiple: true,
    });

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image to upload");
            return;
        }

        try {
            const uploadedMedia: Media[] = [];

            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("type", "image");

                const result = await uploadImage(formData).unwrap();
                uploadedMedia.push(result.data);
            }

            await updateCoreTheme({
                id: themeId,
                payload: {
                    bannerImg: [
                        ...bannerImg,
                        ...uploadedMedia.map((media) => media.url),
                    ],
                },
            })
                .unwrap()
                .then(() => {
                    toast.success(
                        `${uploadedMedia.length} image(s) uploaded successfully`
                    );
                    setIsDialogOpen(false);
                })
                .catch((error) => {
                    toast.error(error.data.message);
                })
                .finally(() => {
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                });
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed");
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newUrls = previewUrls.filter((_, i) => i !== index);

        setSelectedFiles(newFiles);
        setPreviewUrls(newUrls);
    };

    const clearAll = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
    };

    const isUploading = isLoading || isUpdating;

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <Button>Upload Banner</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add Home Page Banner</DialogTitle>
                    <DialogDescription>
                        N.B: Recommended banner size is 1600x500 pixels. Max
                        file size is 4MB.
                    </DialogDescription>
                </DialogHeader>

                {selectedFiles.length === 0 && (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "bg-muted flex cursor-pointer flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed p-6 transition-colors select-none",
                            isDragActive
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25"
                        )}
                        onClick={open}
                    >
                        <input {...getInputProps()} />
                        <CloudUpload className="text-muted-foreground size-10" />
                        <div className="space-y-1.5 text-center">
                            <p className="text-foreground/80 text-sm font-medium">
                                Choose images or Drag & drop them here. Files
                                must be in JPEG, JPG or PNG format
                            </p>
                            <p className="text-muted-foreground text-sm">
                                or click to browse
                            </p>
                        </div>
                    </div>
                )}

                {selectedFiles.length > 0 && (
                    <DialogContainer className="space-y-4 mb-0">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                                Selected Images ({selectedFiles.length})
                            </h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAll}
                                className="text-xs"
                            >
                                Clear All
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative rounded-lg overflow-hidden border">
                                        <img
                                            src={previewUrls[index]}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            width={1600}
                                            height={500}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                        {file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DialogContainer>
                )}

                {selectedFiles.length > 0 && (
                    <div className="flex justify-center">
                        <Button onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadIcon className="h-4 w-4 mr-2" />
                                    Upload {selectedFiles.length} Image
                                    {selectedFiles.length > 1 ? "s" : ""}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
