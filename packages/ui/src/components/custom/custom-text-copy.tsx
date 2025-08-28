"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

/**
 * CustomTextCopy Component
 *
 * Usage:
 * <CustomTextCopy
 *   text="https://buytiq.com/store/coffewala"
 *   copy={true}
 * />
 *
 * Props:
 * - text: string (required) - The text to display and copy
 * - copy: boolean (optional, default: true) - Whether to show the copy button
 * - className: string (optional) - Additional classes for the container
 * - textClassName: string (optional) - Additional classes for the text
 * - buttonClassName: string (optional) - Additional classes for the button
 */

interface CustomTextCopyProps {
  prefixText?: string;
  text: string;
  copy?: boolean;
  className?: string;
  textClassName?: string;
  buttonClassName?: string;
}

export const CustomTextCopy = ({
  prefixText,
  text,
  copy = true,
  className,
  textClassName,
  buttonClassName,
}: CustomTextCopyProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset to copy button after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {prefixText && prefixText}
      <span
        className={cn(
          "flex-1 text-primary line-clamp-1 font-medium text-base",
          textClassName
        )}
      >
        {text}
      </span>
      {copy && (
        <button
          onClick={handleCopy}
          className={cn(" cursor-pointer hover:text-primary", buttonClassName)}
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );
};
