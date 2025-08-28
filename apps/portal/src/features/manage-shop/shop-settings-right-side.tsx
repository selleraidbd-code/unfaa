"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";

import { FileUploader } from "@/components/file-upload/file-uploader";
import { downloadQRCodeFromContainer } from "@/lib/qr-code-utils";
import { Media } from "@/types/media-type";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { Button } from "@workspace/ui/components/button";
import { Download, Palette, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Main Component
export const ShopSettingsRightSide = () => {
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [logo, setLogo] = useState<Media | null>(null);

  console.log("primaryColor :>> ", primaryColor);

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = async () => {
    try {
      await downloadQRCodeFromContainer(qrCodeRef, "shop-qr-code.png", 512);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast("Error", {
        description: "Failed to download QR code. Please try again.",
      });
    }
  };

  const handleLogoUpload = (files: Media[]) => {
    setLogo(files[0] || null);
  };

  const handleLogoRemove = () => {
    setLogo(null);
    toast.success("Logo removed successfully");
  };

  return (
    <div className="w-1/3 space-y-6">
      {/* Shop QR Section */}
      <div className="space-y-4 card">
        <h2 className="sub-title">Shop QR</h2>

        <div className="space-y-2 center" ref={qrCodeRef}>
          <QRCode value={"https://coffewala.unfaa.com"} />
          <p>Scan the QR code to visit your shop</p>
        </div>

        <CustomTextCopy
          text={"https://coffewala.unfaa.com"}
          copy={true}
          className="px-4 py-2 bg-accent rounded-lg"
        />

        <Button className="w-full" onClick={downloadQRCode}>
          <Download /> Download QR Code
        </Button>
      </div>

      {/* Shop Logo Section */}
      <div className="space-y-4 card">
        <h2 className="sub-title">Shop Logo</h2>

        {logo ? (
          <div className="flex items-center justify-center">
            <div className="relative group">
              <Image
                src={logo.url}
                alt="Shop Logo"
                width={160}
                height={160}
                className="border size-32 2xl:size-40 rounded-md object-cover"
              />
              {/* Remove button overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogoRemove}
                  className="rounded-full p-2 absolute right-2 top-2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <FileUploader onImageUpload={handleLogoUpload} />
        )}
      </div>

      {/* Shop Color Section */}
      <div className="space-y-4 card">
        <h2 className="sub-title">Shop Color</h2>

        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="w-full h-32 2xl:h-40 rounded-md border-none outline-none ring-0 [&::-webkit-color-swatch-wrapper]:rounded-md [&::-webkit-color-swatch]:rounded-md [&::-moz-color-swatch]:rounded-md"
        />

        <Button className="w-full">
          <Palette className="size-4" />
          Save Theme Color
        </Button>
      </div>
    </div>
  );
};
