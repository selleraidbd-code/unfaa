"use client";

import React from "react";

import { cn } from "@workspace/ui/lib/utils";

type YouTubeVideoProps = {
    url: string;
    title?: string;
    className?: string;
};

// Utility function to convert YouTube URL to embeddable format
const getYouTubeEmbedUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        let videoId = "";

        // Handle youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
            videoId = urlObj.searchParams.get("v") || "";
        }
        // Handle youtu.be/VIDEO_ID
        else if (urlObj.hostname.includes("youtu.be")) {
            videoId = urlObj.pathname.slice(1);
        }
        // If already an embed URL, extract video ID
        else if (url.includes("/embed/")) {
            const match = url.match(/\/embed\/([^?]+)/);
            if (match && match[1]) {
                videoId = match[1];
            } else {
                return url;
            }
        } else {
            // Return original URL if not a recognized YouTube format
            return url;
        }

        // Add parameters to minimize suggestions and branding
        const params = new URLSearchParams({
            rel: "0", // Don't show related videos from other channels
            modestbranding: "1", // Minimal YouTube branding
            showinfo: "0", // Hide video title and uploader
            iv_load_policy: "3", // Hide video annotations
            controls: "1", // Show controls
            disablekb: "0", // Enable keyboard controls
            fs: "1", // Allow fullscreen
            playsinline: "1", // Play inline on iOS
            autohide: "1", // Auto-hide controls
            loop: "0", // Loop the video to reduce end screen suggestions
            playlist: videoId, // Required for loop to work
        });

        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } catch (error) {
        console.error("Error parsing video URL:", error);
        return url;
    }
};

export const YouTubeVideo = ({ url, title = "YouTube video player", className = "" }: YouTubeVideoProps) => {
    const embedUrl = getYouTubeEmbedUrl(url);

    return (
        <div className={cn("aspect-video overflow-hidden rounded-xl bg-gray-100", className)}>
            <iframe
                src={embedUrl}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};
