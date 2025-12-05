"use client";

import { useEffect, useRef, useState } from "react";

import { useGetImagesQuery } from "@/redux/api/media-api";

import { useAppSelector } from "@/redux/store/hook";
import { Media } from "@/types/media-type";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

import { FileModal } from "./file-modal";
import { FileUploader } from "./file-uploader";
import { SelectedFilesViewer } from "./selected-files-viewer";

interface FileUploadProps {
    onFilesSelected?: (files: Media[]) => void;
    initialFiles?: string[];
    limit?: number;
    className?: string;
    label?: string;
    isMinimal?: boolean;
}

export const FileUpload = ({
    onFilesSelected,
    initialFiles = [],
    limit = 10,
    className,
    label,
    isMinimal = false,
}: FileUploadProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const isInitialFileLoaded = useRef(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<Media[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState<Media[]>([]);

    const { data: images, isLoading } = useGetImagesQuery({
        userId: user?.id,
        limit: 100,
    });

    const handleSelectFiles = (files: Media[]) => {
        const limitedFiles = limit ? files.slice(0, limit) : files;

        setSelectedFiles(limitedFiles);
        setIsModalOpen(false);
        if (onFilesSelected) {
            onFilesSelected(limitedFiles);
        }
    };

    const openFileUploadModal = () => {
        setIsModalOpen(true);
    };

    const handleRemoveFile = (fileId: string) => {
        const updatedFiles = selectedFiles.filter((f) => f.id !== fileId);
        setSelectedFiles(updatedFiles);
        if (onFilesSelected) {
            onFilesSelected(updatedFiles);
        }
    };

    const onImageUpload = (files: Media[]) => {
        setIsUploading(false);

        let newFiles = [...selectedFiles];
        if (limit && newFiles.length + files.length > limit) {
            newFiles = newFiles.slice(0, limit - files.length);
        }
        setSelectedFiles([...newFiles, ...files]);
        if (onFilesSelected) {
            onFilesSelected([...newFiles, ...files]);
        }
    };

    const hasReachedLimit =
        limit !== undefined && selectedFiles.length >= limit;

    useEffect(() => {
        if (images) {
            setFiles(images.data.flat());
        }
    }, [images]);

    useEffect(() => {
        if (isInitialFileLoaded.current) return;

        if (files.length && initialFiles.length > 0) {
            const initialFilesList = files.filter((file) =>
                initialFiles.includes(file.url)
            );
            if (initialFilesList.length > 0) {
                setSelectedFiles(initialFilesList);
                isInitialFileLoaded.current = true;
            }
        }
    }, [files, initialFiles]);

    return (
        <>
            <div className={cn("@container space-y-2", className)}>
                <div className="flex items-center justify-between">
                    <Label>{label || "Media"}</Label>
                    {limit && limit > 1 && (
                        <span className="text-muted-foreground text-sm">
                            {selectedFiles.length}/{limit} selected
                        </span>
                    )}
                </div>

                {selectedFiles.length === 0 ? (
                    <FileUploader
                        onImageUpload={onImageUpload}
                        disableDefaultUpload
                        openFileUploadModal={openFileUploadModal}
                        onUploadStart={() => setIsUploading(true)}
                        isMinimal={isMinimal}
                    />
                ) : (
                    <SelectedFilesViewer
                        selectedFiles={selectedFiles}
                        limit={limit}
                        handleRemoveFile={handleRemoveFile}
                        openFileUploadModal={openFileUploadModal}
                        hasReachedLimit={hasReachedLimit}
                        isUploading={isUploading}
                        isMinimal={isMinimal}
                    />
                )}
            </div>

            <FileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectFiles}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                limit={limit}
                files={files}
                isLoading={isLoading}
            />
        </>
    );
};
