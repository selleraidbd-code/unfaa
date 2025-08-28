"use client";

import { useState } from "react";
import Image from "next/image";

import { Check, Copy, X } from "lucide-react";

import type { Media } from "@/types/media-type";
import { Button } from "@workspace/ui/components/button";

interface MediaPreviewProps {
  file: Media;
  setPreviewFile: (file: Media | null) => void;
}

export function MediaPreview({ file, setPreviewFile }: MediaPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(file.url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">Preview</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full border border-gray-500 p-0"
          onClick={() => setPreviewFile(null)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-muted/20 flex flex-1 items-center justify-center overflow-hidden rounded-md">
        <div className="relative h-full min-h-[200px] w-full">
          {isLoading && (
            <div className="bg-muted flex h-full w-full animate-pulse items-center justify-center">
              <div className="bg-muted-foreground/30 h-32 w-32 rounded" />
            </div>
          )}
          <Image
            src={file.url || "/placeholder.jpg"}
            alt={file.url}
            className="h-full w-full object-contain"
            onLoad={() => setIsLoading(false)}
            fill
          />
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t-2 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-medium">{file.url}</h3>
          <button
            className="ml-3 cursor-pointer"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy URL"}
          >
            {copied ? (
              <Check className="size-5 text-green-500" />
            ) : (
              <Copy className="size-5" />
            )}
          </button>
        </div>
        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            {formatDate(new Date(file.createdAt))} • {file.type}
          </p>
        </div>
      </div>
    </div>
  );
}
