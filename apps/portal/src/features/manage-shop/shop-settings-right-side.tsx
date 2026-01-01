"use client";

import { useRef } from "react";

import { Button } from "@workspace/ui/components/button";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { toast } from "@workspace/ui/components/sonner";
import { Download } from "lucide-react";
import QRCode from "react-qr-code";

import { downloadQRCodeFromContainer } from "@/lib/qr-code-utils";

export const ShopSettingsRightSide = () => {
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

    const shopUrl = "https://coffewala.unfaa.com";

    return (
        <div className="space-y-6 lg:w-1/3">
            {/* Shop QR Section */}
            <div className="card space-y-4">
                <h2 className="sub-title">Shop QR</h2>

                <div className="center space-y-2" ref={qrCodeRef}>
                    <QRCode value={shopUrl} />
                    <p>Scan the QR code to visit your shop</p>
                </div>

                <CustomTextCopy text={shopUrl} copy={true} className="bg-accent rounded-lg px-4 py-2" href={shopUrl} />

                <Button className="w-full" onClick={downloadQRCode}>
                    <Download /> Download QR Code
                </Button>
            </div>
        </div>
    );
};
