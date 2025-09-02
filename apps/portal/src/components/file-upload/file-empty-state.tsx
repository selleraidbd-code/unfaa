"use client";

import Image from "next/image";
import emptyImage from "@/assets/images/empty.jpg";

import { FileUploader } from "./file-uploader";

interface EmptyStateProps {
  title?: string;
}

export function EmptyState({ title = "No files available" }: EmptyStateProps) {
  return (
    <div className="h-full w-full">
      <FileUploader />
      <Image
        src={emptyImage}
        alt="Empty state"
        width={400}
        height={400}
        className="mx-auto mt-4"
      />
      <h3 className="text-muted-foreground mt-4 text-center text-xl font-medium">
        {title}
      </h3>
    </div>
  );
}
