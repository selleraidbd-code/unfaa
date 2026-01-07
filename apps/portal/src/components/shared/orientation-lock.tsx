"use client";

import { useEffect } from "react";

// Extend ScreenOrientation interface for better type support
interface ScreenOrientationWithLock extends ScreenOrientation {
    lock?: (
        orientation:
            | "portrait"
            | "portrait-primary"
            | "portrait-secondary"
            | "landscape"
            | "landscape-primary"
            | "landscape-secondary"
    ) => Promise<void>;
}

export function OrientationLock() {
    useEffect(() => {
        // Check if the Screen Orientation API is available
        if (typeof window !== "undefined" && "screen" in window) {
            const lockOrientation = async () => {
                try {
                    const orientation = screen.orientation as ScreenOrientationWithLock;

                    // Try to lock orientation to portrait
                    if (orientation?.lock) {
                        await orientation.lock("portrait-primary").catch((err: Error) => {
                            // Silently handle the error as some browsers/contexts don't support this
                            console.warn("Orientation lock not supported:", err.message);
                        });
                    }
                } catch (error) {
                    // Some browsers don't support this API
                    console.warn("Screen Orientation API not available");
                }
            };

            // Lock orientation when component mounts
            lockOrientation();

            // Listen for fullscreen changes (orientation lock requires fullscreen in some browsers)
            const handleFullscreenChange = () => {
                if (document.fullscreenElement) {
                    lockOrientation();
                }
            };

            document.addEventListener("fullscreenchange", handleFullscreenChange);

            return () => {
                document.removeEventListener("fullscreenchange", handleFullscreenChange);
            };
        }
    }, []);

    return null;
}
