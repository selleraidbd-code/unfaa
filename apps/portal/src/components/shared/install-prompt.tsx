"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Better TypeScript declarations
declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
    interface Window {
        MSStream?: unknown;
    }
    interface Navigator {
        standalone?: boolean;
    }
}

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const isInStandaloneMode =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone ||
            document.referrer.includes("android-app://");

        setIsStandalone(isInStandaloneMode);

        if (isInStandaloneMode) {
            return;
        }

        // Check if iOS
        const iOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        // Check if user has already dismissed (1 day cooldown)
        const hasAlreadyDismissed = localStorage.getItem(
            "pwa-install-dismissed"
        );
        const dismissedTime = hasAlreadyDismissed
            ? parseInt(hasAlreadyDismissed)
            : 0;
        const oneDayInMs = 24 * 60 * 60 * 1000;

        if (hasAlreadyDismissed && Date.now() - dismissedTime < oneDayInMs) {
            return;
        }

        // Listen for beforeinstallprompt event (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => {
                if (!isInStandaloneMode) {
                    setShowPrompt(true);
                }
            }, 3000);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        // Show iOS prompt if applicable
        if (iOS && !hasAlreadyDismissed) {
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        }

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setShowPrompt(false);
            setDeferredPrompt(null);
        } else {
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    };

    if (isStandalone || !showPrompt) {
        return null;
    }

    return (
        <div className="fixed md:bottom-4 bottom-20 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in-0 duration-300 w-[calc(100%-2rem)] max-w-sm ">
            <Card className="shadow-lg gap-2 border-2">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold">
                                Install Unfaa Store
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {isIOS ? (
                                    <>
                                        Tap the{" "}
                                        <Share className="inline h-4 w-4 mx-1" />{" "}
                                        button and select "Add to Home Screen"
                                    </>
                                ) : (
                                    "Install our app for a better experience. Get quick access and work offline."
                                )}
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={handleDismiss}
                            aria-label="Close install prompt"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {!isIOS && (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleInstallClick}
                                className="flex-1"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Install App
                            </Button>
                            <Button variant="outline" onClick={handleDismiss}>
                                Maybe Later
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
