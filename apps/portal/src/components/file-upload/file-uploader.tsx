"use client";

import { useCallback } from "react";

import { useUploadImageMutation } from "@/redux/api/media-api";
import { CloudUpload, ImageIcon, Loader, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "@workspace/ui/components/sonner";

import { Media } from "@/types/media-type";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface FileUploaderProps {
    openFileUploadModal?: () => void;
    disableDefaultUpload?: boolean;
    className?: string;
    onImageUpload?: (files: Media[]) => void;
    onUploadStart?: () => void;
    isMinimal?: boolean;
    type?: "image" | "video";
}

export const FileUploader = ({
    openFileUploadModal,
    disableDefaultUpload = false,
    className,
    onImageUpload,
    onUploadStart,
    isMinimal = false,
    type = "image",
}: FileUploaderProps) => {
    const [uploadImage, { isLoading }] = useUploadImageMutation();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0 && onUploadStart) {
                onUploadStart();
            }

            acceptedFiles.forEach((file) => {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("type", type);
                uploadImage(formData)
                    .unwrap()
                    .then((res) => {
                        if (onImageUpload) {
                            onImageUpload([res.data]);
                        }
                        toast.success(
                            `${type === "image" ? "Image" : type === "video" ? "Video" : "File"} uploaded successfully`
                        );
                    })
                    .catch(() => {
                        toast.error(
                            `${type === "image" ? "Image" : type === "video" ? "Video" : "File"} upload failed`
                        );
                    });
            });
        },
        [uploadImage, onImageUpload, onUploadStart, type]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        onDropRejected: (rejectedFiles) => {
            rejectedFiles.forEach((rejection) => {
                const fileType = rejection.file.type;

                if (type === "image" && fileType.startsWith("video/")) {
                    toast.error(
                        `Video files are not allowed. Please upload an image file (JPEG, JPG, PNG).`
                    );
                } else if (type === "video" && fileType.startsWith("image/")) {
                    toast.error(
                        `Image files are not allowed. Please upload a video file (MP4, AVI, MOV, WebM).`
                    );
                } else {
                    toast.error(
                        `Invalid file type. Please upload a ${type === "image" ? "image" : type === "video" ? "video" : "supported"} file.`
                    );
                }
            });
        },
        accept:
            type === "image"
                ? {
                      "image/*": [],
                  }
                : type === "video"
                  ? {
                        "video/*": [],
                    }
                  : {
                        "image/*": [],
                        "video/*": [],
                        "model/gltf-binary": [],
                        "model/gltf+json": [],
                        "application/octet-stream": [".glb"],
                        "application/json": [".gltf"],
                    },
        noClick: disableDefaultUpload,
    });

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disableDefaultUpload && openFileUploadModal) {
            e.stopPropagation();
            e.preventDefault();
            openFileUploadModal();
        } else {
            open();
        }
    };

    const handleUploadButtonClick = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (disableDefaultUpload) {
            e.stopPropagation();
            e.preventDefault();
            open();
        }
    };

    const handleMediaButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (openFileUploadModal) {
            e.stopPropagation();
            e.preventDefault();
            openFileUploadModal();
        }
    };

    const handleMinimalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (openFileUploadModal) {
            e.stopPropagation();
            e.preventDefault();
            openFileUploadModal();
        }
    };

    if (isMinimal) {
        if (isLoading) {
            return (
                <div
                    className={cn(
                        "bg-muted cursor-not-allowed center rounded-md border-2 border-dashed h-11 px-3 select-none",
                        className
                    )}
                >
                    <Loader className="text-muted-foreground size-7 animate-spin" />
                </div>
            );
        }

        return (
            <div
                className={cn(
                    "bg-muted flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed h-11 px-3 transition-colors select-none",
                    className
                )}
                onClick={handleMinimalClick}
            >
                <input {...getInputProps()} />
                <CloudUpload className={`text-muted-foreground size-4 mr-2`} />
                <span className="text-foreground/80 text-sm">
                    Upload{" "}
                    {type === "image"
                        ? "Image"
                        : type === "video"
                          ? "Video"
                          : "Media"}
                </span>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div
                className={cn(
                    "bg-muted cursor-not-allowed center rounded-md border-2 border-dashed h-40 px-3 select-none",
                    className
                )}
            >
                <Loader className="text-muted-foreground size-7 animate-spin" />
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "bg-muted flex cursor-pointer flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed p-6 transition-colors select-none",
                isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25",
                className
            )}
            onClick={handleContainerClick}
        >
            <input {...getInputProps()} />
            <CloudUpload className={`text-muted-foreground size-10`} />
            <div className="space-y-1.5 text-center">
                <p className={`text-foreground/80 text-sm font-medium`}>
                    Choose a file or Drag & drop it here. File must be in{" "}
                    {type === "image"
                        ? "JPEG, JPG or PNG"
                        : type === "video"
                          ? "MP4, AVI, MOV or WebM"
                          : "JPEG, JPG, PNG, MP4, AVI, MOV or WebM"}{" "}
                    format
                </p>
                <p className="text-muted-foreground text-sm">
                    or click to browse
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleUploadButtonClick}
                >
                    <UploadIcon className="h-4 w-4" />
                    <span>Upload new</span>
                </Button>
                {openFileUploadModal && (
                    <Button
                        variant="outline"
                        onClick={handleMediaButtonClick}
                        className="flex items-center space-x-2"
                    >
                        <ImageIcon className="h-4 w-4" />
                        <span>Select existing</span>
                    </Button>
                )}
            </div>
        </div>
    );
};
