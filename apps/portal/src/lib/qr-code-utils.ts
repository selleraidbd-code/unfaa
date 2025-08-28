/**
 * QR Code Utilities
 * Provides functions for QR code generation and download
 */

/**
 * Downloads a QR code SVG element as a PNG image
 * @param qrCodeElement - The SVG element containing the QR code
 * @param filename - The filename for the downloaded file (default: 'qr-code.png')
 * @param size - The size of the output image (default: 512)
 * @returns Promise that resolves when download is complete
 */
export const downloadQRCode = async (
    qrCodeElement: SVGElement,
    filename: string = "qr-code.png",
    size: number = 512
): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            // Create a canvas with proper dimensions
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Failed to create canvas context"));
                return;
            }

            // Set canvas size for high quality
            canvas.width = size;
            canvas.height = size;

            // Fill white background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, size, size);

            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(
                qrCodeElement
            );
            const svgBlob = new Blob([svgData], {
                type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(svgBlob);

            const img = new window.Image();

            img.onload = () => {
                try {
                    // Calculate center position for the QR code
                    const qrSize = size * 0.9; // QR code takes 95% of canvas (reduced white border)
                    const x = (size - qrSize) / 2;
                    const y = (size - qrSize) / 2;

                    // Draw the QR code centered
                    ctx.drawImage(img, x, y, qrSize, qrSize);

                    // Convert to blob and download
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const downloadUrl = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = downloadUrl;
                                link.download = filename;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                // Clean up
                                URL.revokeObjectURL(downloadUrl);
                                URL.revokeObjectURL(url);

                                resolve();
                            } else {
                                reject(new Error("Failed to create blob"));
                            }
                        },
                        "image/png",
                        1.0
                    ); // Maximum quality
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Failed to load QR code image"));
            };

            img.src = url;
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Downloads a QR code from a container element
 * @param containerRef - Reference to the container element
 * @param filename - The filename for the downloaded file
 * @param size - The size of the output image
 * @returns Promise that resolves when download is complete
 */
export const downloadQRCodeFromContainer = async (
    containerRef: React.RefObject<HTMLDivElement | null>,
    filename: string = "qr-code.png",
    size: number = 512
): Promise<void> => {
    if (!containerRef.current) {
        throw new Error("Container element not found");
    }

    const qrCodeElement = containerRef.current.querySelector(
        "svg"
    ) as SVGElement;
    if (!qrCodeElement) {
        throw new Error("QR code element not found");
    }

    return downloadQRCode(qrCodeElement, filename, size);
};
