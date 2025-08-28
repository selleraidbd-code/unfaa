import Image from "next/image";

import { Eye } from "lucide-react";

import { Media } from "@/types/media-type";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";

interface FileCardProps {
  file: Media;
  toggleFileSelection: (file: Media) => void;
  selectedFiles: Media[];
  setPreviewFile: (file: Media) => void;
}

export const FileCard = ({
  file,
  toggleFileSelection,
  selectedFiles,
  setPreviewFile,
}: FileCardProps) => {
  return (
    <div
      key={file.id}
      className={cn("group relative overflow-hidden rounded-md border")}
      onClick={() => toggleFileSelection(file)}
      style={{
        cursor: "pointer",
      }}
    >
      <div
        className="absolute top-2 left-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selectedFiles.some((f) => f.id === file.id)}
          onCheckedChange={() => toggleFileSelection(file)}
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
        />
      </div>

      <div className="absolute inset-0 flex items-end justify-end bg-black/50 p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewFile(file);
          }}
          className="bg-white/70 text-blue-500"
        >
          <Eye className="h-5 w-5" />
        </Button>
      </div>

      <Image
        src={
          file.url ||
          "http://multi-media-server.naimurrhman.com/uploads/img/1745774284366-565507199.jpg"
        }
        alt={file.url}
        className="aspect-square w-full object-cover"
        width={400}
        height={400}
      />
    </div>
  );
};
