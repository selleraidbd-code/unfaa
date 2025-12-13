"use client";

import { useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Download, Share, X } from "lucide-react";

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
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode) - improved detection
        const checkStandalone = () => {
            return (
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as Navigator).standalone === true ||
                document.referrer.includes("android-app://") ||
                window.location.search.includes("utm_source=pwa") ||
                (window.navigator as any).getInstalledRelatedApps?.() !== undefined
            );
        };

        const isInStandaloneMode = checkStandalone();
        setIsStandalone(isInStandaloneMode);

        // If already installed, don't show prompt
        if (isInStandaloneMode) {
            return;
        }

        // Check if already dismissed in this session
        const sessionDismissed = sessionStorage.getItem("pwa-install-dismissed");
        if (sessionDismissed === "true") {
            return;
        }

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        const timeoutIds: NodeJS.Timeout[] = [];

        // Function to show prompt after delay (with checks)
        const schedulePrompt = (delay: number = 3000) => {
            const timeoutId = setTimeout(() => {
                // Double-check standalone and session dismissal before showing
                if (!checkStandalone() && !sessionStorage.getItem("pwa-install-dismissed")) {
                    setShowPrompt(true);
                }
            }, delay);
            timeoutIds.push(timeoutId);
        };

        // Listen for beforeinstallprompt event (Android/Chrome)
        // This event may not fire if browser already showed native prompt or criteria not met
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);

            // Schedule prompt to show after delay
            if (!sessionDismissed && !isInStandaloneMode) {
                schedulePrompt(3000);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Fallback: Show prompt for all platforms after delay
        // This ensures prompt shows even if beforeinstallprompt doesn't fire
        // For iOS, show instructions; for others, show install button (if deferredPrompt available)
        schedulePrompt(5000); // Slightly longer delay to give beforeinstallprompt time to fire

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            timeoutIds.forEach((id) => clearTimeout(id));
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // If no deferred prompt, provide instructions or try browser's native install
            // For Chrome/Edge: User can click the install icon in address bar
            // For other browsers: Show instructions
            handleDismiss();
            return;
        }

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                setShowPrompt(false);
                setDeferredPrompt(null);
                // Mark as dismissed in session since installation was accepted
                sessionStorage.setItem("pwa-install-dismissed", "true");
            } else {
                handleDismiss();
            }
        } catch (error) {
            // If prompt fails, just dismiss
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Store dismissal in sessionStorage (session-based, not persistent)
        sessionStorage.setItem("pwa-install-dismissed", "true");
    };

    if (isStandalone || !showPrompt) {
        return null;
    }

    return (
        <div className="animate-in slide-in-from-bottom-5 fade-in-0 fixed right-4 bottom-20 z-50 w-[calc(100%-2rem)] max-w-sm duration-300 md:bottom-4">
            <Card className="gap-2 border-2 shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold">Install Unfaa Store</CardTitle>
                            <CardDescription className="mt-1">
                                {isIOS ? (
                                    <>
                                        Tap the <Share className="mx-1 inline h-4 w-4" /> button and select "Add to Home
                                        Screen"
                                    </>
                                ) : deferredPrompt ? (
                                    "Install our app for a better experience. Get quick access and work offline."
                                ) : (
                                    "Install our app for a better experience. Look for the install icon in your browser's address bar, or use the browser menu."
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
                            <Button onClick={handleInstallClick} className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                {deferredPrompt ? "Install App" : "Got It"}
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
