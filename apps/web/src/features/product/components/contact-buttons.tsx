"use client";

import { Messenger, WhatsApp } from "@/assets/icons";

type ContactButtonsProps = {
    whatsappNumber?: string;
    facebookPageId?: string;
};

export const ContactButtons = ({ whatsappNumber, facebookPageId }: ContactButtonsProps) => {
    // Don't render if no contact data
    if (!whatsappNumber && !facebookPageId) {
        return null;
    }

    const handleWhatsAppClick = () => {
        if (whatsappNumber) {
            // Remove all non-digit characters (spaces, +, -, etc.)
            let cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

            // Handle Bangladeshi phone numbers
            if (cleanNumber.startsWith("880")) {
                // Already has country code: 8801625269817
                // Use as is
            } else if (cleanNumber.startsWith("0")) {
                // Remove leading 0 and add 880
                // Example: 01625269817 -> 8801625269817
                cleanNumber = "880" + cleanNumber.substring(1);
            } else if (cleanNumber.length === 10 || cleanNumber.length === 11) {
                // 10-11 digit number without country code, add 880
                // Example: 1625269817 -> 8801625269817
                cleanNumber = "880" + cleanNumber;
            }

            // Open WhatsApp with formatted number
            // Format: https://wa.me/8801625269817 (without +)
            if (cleanNumber.startsWith("880") && cleanNumber.length >= 13) {
                window.open(`https://wa.me/${cleanNumber}`, "_blank");
            }
        }
    };

    const handleMessengerClick = () => {
        if (facebookPageId) {
            let pageIdentifier = facebookPageId.trim();

            // If it's just a username (like "takfee") or numeric ID (like "638463789343846"), use it directly
            // Check if it's a simple identifier (no URL structure)
            if (!pageIdentifier.includes("facebook.com") && !pageIdentifier.includes("http")) {
                // It's already a username or ID, use as is
                pageIdentifier = pageIdentifier.replace(/[^a-zA-Z0-9._-]/g, "");
            } else {
                // It's a URL, extract the identifier

                // Case 1: Extract ID from profile URL
                // Example: https://www.facebook.com/profile.php?id=638463789343846
                const profileIdMatch = pageIdentifier.match(/[?&]id=(\d+)/);
                if (profileIdMatch && profileIdMatch[1]) {
                    pageIdentifier = profileIdMatch[1];
                } else {
                    // Case 2: Extract from page URL
                    // Example: https://www.facebook.com/takfee
                    // Example: https://www.facebook.com/638463789343846
                    const pageUrlMatch = pageIdentifier.match(/facebook\.com\/([^/?&#]+)/);
                    if (pageUrlMatch && pageUrlMatch[1]) {
                        const extracted = pageUrlMatch[1];
                        // Skip profile.php and other special paths
                        if (extracted !== "profile.php" && !extracted.includes("profile.php")) {
                            pageIdentifier = extracted;
                        }
                    } else {
                        // Fallback: clean up URL
                        pageIdentifier = pageIdentifier
                            .replace(/^https?:\/\//, "")
                            .replace(/^www\./, "")
                            .replace(/^m\./, "")
                            .replace(/^facebook\.com\//, "")
                            .replace(/\/.*$/, "")
                            .replace(/\?.*$/, "")
                            .replace(/#.*$/, "");
                    }
                }

                // Final cleanup: remove any remaining special characters
                pageIdentifier = pageIdentifier.replace(/[^a-zA-Z0-9._-]/g, "");
            }

            // Open Messenger link
            if (pageIdentifier) {
                window.open(`https://m.me/${pageIdentifier}`, "_blank");
            }
        }
    };

    return (
        <div className="mb-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-md">
            <h3 className="mb-4 text-center text-xl font-bold text-gray-800">যোগাযোগ করুন</h3>
            <div className="grid gap-3 sm:grid-cols-2">
                {whatsappNumber && (
                    <button
                        onClick={handleWhatsAppClick}
                        className="group flex items-center justify-center gap-3 rounded-lg bg-green-500 px-6 py-4 font-semibold text-white transition-all hover:bg-green-600 hover:shadow-lg active:scale-95"
                    >
                        <WhatsApp className="h-6 w-6" />
                        <span className="text-lg">WhatsApp করুন</span>
                    </button>
                )}

                {facebookPageId && (
                    <button
                        onClick={handleMessengerClick}
                        className="group flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-6 py-4 font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95"
                    >
                        <Messenger className="h-6 w-6" />
                        <span className="text-lg">মেসেজ করুন</span>
                    </button>
                )}
            </div>
        </div>
    );
};
