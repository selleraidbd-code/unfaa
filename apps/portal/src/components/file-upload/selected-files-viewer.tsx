import Image from "next/image";
import { useState } from "react";

import { Eye, Plus, Trash2, X } from "lucide-react";

import { Media } from "@/types/media-type";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";

interface SelectedFilesViewerProps {
  selectedFiles: Media[];
  limit?: number;
  handleRemoveFile: (fileId: string) => void;
  openFileUploadModal: () => void;
  hasReachedLimit: boolean;
  isUploading: boolean;
  isMinimal?: boolean;
}

export const SelectedFilesViewer = ({
  selectedFiles,
  limit,
  handleRemoveFile,
  openFileUploadModal,
  hasReachedLimit,
  isUploading,
  isMinimal = false,
}: SelectedFilesViewerProps) => {
  const [selectedFile, setSelectedFile] = useState<Media | null>(null);

  const length = selectedFiles.length > 1;

  const height =
    "min-h-20 @xl:min-h-24 @2xl:min-h-32 @3xl:min-h-36 @5xl:min-h-40";

  if (isMinimal) {
    const file = selectedFiles[0];
    return (
      <>
        <div
          key={file?.id}
          className="flex items-center cursor-pointer justify-between gap-2 rounded-md border bg-gray-50 px-3 py-2.5"
          onClick={() => setSelectedFile(file || null)}
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Media Uploaded</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="size-5" />

            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-red-100 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(file?.id || "");
              }}
            >
              <X />
            </Button>
          </div>
        </div>

        {selectedFile && (
          <FilePreviewInDialog
            file={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "gap-1 @xl:gap-1 @3xl:gap-2 @5xl:gap-3",
          limit === 1
            ? "mx-auto sm:w-1/4 @sm:grid-cols-1"
            : "grid grid-cols-2 @sm:grid-cols-3 @lg:grid-cols-4 @2xl:grid-cols-5 @3xl:grid-cols-6 @4xl:grid-cols-7 @6xl:grid-cols-8 @7xl:grid-cols-9"
        )}
      >
        {selectedFiles.map((file, index) => (
          <div
            key={file.id + index}
            className={cn(
              "group relative",
              height,
              length && index === 0 && "@sm:col-span-2 @sm:row-span-2"
            )}
            onClick={() => setSelectedFile(file)}
          >
            <Image
              src={file.url || "/placeholder.jpg"}
              alt={file.url}
              className={cn(
                "aspect-square h-full w-full rounded-md border object-contain"
              )}
              fill
            />
            <div className="absolute inset-0 flex justify-end rounded-md bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="destructive"
                size="icon"
                className="size-7"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(file.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {isUploading && (
          <div
            className={cn(
              "relative animate-pulse bg-gray-100",
              height,
              selectedFiles.length === 0 && "col-span-2 row-span-2"
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
            </div>
          </div>
        )}

        {!hasReachedLimit && (
          <div
            onClick={openFileUploadModal}
            className={cn(
              "center bg-accent/70 hover:bg-accent cursor-pointer rounded-md border border-dashed border-gray-400",
              height
            )}
          >
            <Plus className="text-muted-foreground size-6" />
          </div>
        )}
      </div>

      {selectedFile && (
        <FilePreviewInDialog
          file={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}
    </>
  );
};

const FilePreviewInDialog = ({
  file,
  setSelectedFile,
}: {
  file: Media | null;
  setSelectedFile: (file: Media | null) => void;
}) => {
  return (
    <Dialog open={!!file} onOpenChange={() => setSelectedFile(null)}>
      <DialogHeader>
        <DialogTitle>Preview</DialogTitle>
        <DialogDescription> this is a description</DialogDescription>
      </DialogHeader>
      <DialogContent className="h-[50vh] w-[90vw] md:h-[90vh] md:w-[80vw]">
        {file && (
          <Image
            src={file.url || ""}
            alt={file.url || ""}
            className={`h-full w-full object-contain shadow-md`}
            fill
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
