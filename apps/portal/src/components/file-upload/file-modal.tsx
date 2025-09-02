"use client";

import { useState } from "react";
import Image from "next/image";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import type { Media } from "@/types/media-type";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { FileCard } from "@/components/file-upload/file-card";

import { EmptyState } from "./file-empty-state";
import { MediaPreview } from "./file-preview";
import { FileUploader } from "./file-uploader";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (files: Media[]) => void;
  selectedFiles: Media[];
  setSelectedFiles: (files: Media[]) => void;
  limit?: number;
  files: Media[];
  isLoading: boolean;
}

export const FileModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedFiles,
  setSelectedFiles,
  limit,
  files,
  isLoading,
}: MediaModalProps) => {
  const [fileType, setFileType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [previewFile, setPreviewFile] = useState<Media | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredFiles = files
    .filter((file) => {
      const matchesType =
        fileType === "all" ||
        (fileType === "image" && file.type.startsWith("image/")) ||
        (fileType === "video" && file.type.startsWith("video/")) ||
        (fileType === "other" &&
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/"));

      // Only show files that match the active tab
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "selected" &&
          selectedFiles.some((f) => f.id === file.id));

      return matchesType && matchesTab;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const hasReachedLimit = limit !== undefined && selectedFiles.length >= limit;

  const toggleFileSelection = (file: Media) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      if (!hasReachedLimit) {
        setSelectedFiles([...selectedFiles, file]);
      } else {
        toast.error("You have reached the maximum limit of files");
      }
    }
  };

  const sortOptions = [
    {
      label: "New to old",
      value: "newest",
    },
    {
      label: "Old to new",
      value: "oldest",
    },
  ];

  const fileTypeOptions = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Images",
      value: "image",
    },
    {
      label: "Videos",
      value: "video",
    },
    {
      label: "Others",
      value: "other",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="lg:max-w-5xl xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Select file</DialogTitle>
          <DialogDescription className="sr-only">
            Select the files you want to upload
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 max-lg:h-[60dvh] max-lg:flex-col-reverse max-lg:gap-4 max-lg:overflow-y-auto lg:overflow-hidden">
          <div className="flex flex-1 flex-col lg:overflow-hidden">
            <div
              className={cn(
                "mb-4 flex items-center",
                files.length === 0 && "hidden"
              )}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="all">All Media</TabsTrigger>
                  <TabsTrigger value="selected">Selected</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden">
                    File type
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={fileType}
                    onValueChange={setFileType}
                  >
                    {fileTypeOptions.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={sortOption}
                    onValueChange={setSortOption}
                  >
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-full flex-1 lg:overflow-auto lg:rounded-md lg:border lg:p-4">
              {!isLoading && filteredFiles.length === 0 ? (
                <EmptyState
                  title={
                    activeTab === "all"
                      ? "No files available"
                      : "No selected files found"
                  }
                />
              ) : (
                <div className="@container space-y-4">
                  <FileUploader />

                  <div
                    className={cn(
                      "grid grid-cols-2 max-h-[45dvh] overflow-y-auto scrollbar-thin select-none @sm:grid-cols-3 @sm:gap-2 @md:grid-cols-3 @lg:grid-cols-4 @2xl:grid-cols-4 @3xl:grid-cols-5 @3xl:gap-3 @5xl:grid-cols-7"
                    )}
                  >
                    {isLoading
                      ? Array.from({ length: 10 }).map((_, index) => (
                          <Image
                            key={index}
                            src="/placeholder.jpg"
                            alt="loading"
                            width={400}
                            height={400}
                            className="animate-pulse"
                          />
                        ))
                      : filteredFiles.map((file) => (
                          <FileCard
                            key={file.id}
                            file={file}
                            toggleFileSelection={toggleFileSelection}
                            selectedFiles={selectedFiles}
                            setPreviewFile={setPreviewFile}
                          />
                        ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {previewFile && (
            <div className="flex flex-col max-lg:mx-auto max-lg:max-h-[35vh] max-lg:max-w-[80%] max-lg:rounded-md max-lg:border max-lg:px-4 max-lg:py-2 lg:ml-4 lg:w-1/3 lg:border-l lg:pl-4">
              <MediaPreview
                file={previewFile}
                setPreviewFile={setPreviewFile}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div
            className={cn(
              "text-muted-foreground text-sm",
              files.length === 0 && "hidden"
            )}
          >
            {selectedFiles.length} file
            {selectedFiles.length > 1 ? "s" : ""} selected
          </div>
          <div className="ml-auto flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSelect(selectedFiles)}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
