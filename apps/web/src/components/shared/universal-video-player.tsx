"use client";

/**
 * UniversalVideoPlayer Component
 *
 * A flexible video player that automatically detects and embeds videos from:
 * - YouTube (youtube.com, youtu.be)
 * - Facebook (facebook.com, fb.watch, facebook.com/share/v/)
 * - TikTok (tiktok.com, vt.tiktok.com, vm.tiktok.com)
 *
 * Usage:
 * <UniversalVideoPlayer url="https://vt.tiktok.com/ZS5dfFJvq/" title="Product Video" />
 * <UniversalVideoPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
 * <UniversalVideoPlayer url="https://www.facebook.com/watch?v=123456789" />
 * <UniversalVideoPlayer url="https://www.facebook.com/share/v/17PX5rAb8q/" />
 */
import React from "react";

import { cn } from "@workspace/ui/lib/utils";

type UniversalVideoPlayerProps = {
    url: string;
    title?: string;
    className?: string;
};

type VideoType = "youtube" | "facebook" | "tiktok" | "unknown";

// Detect video platform from URL
const detectVideoType = (url: string): VideoType => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const pathname = urlObj.pathname.toLowerCase();

        if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
            return "youtube";
        }
        // Detect Facebook URLs including share links
        if (
            hostname.includes("facebook.com") ||
            hostname.includes("fb.watch") ||
            hostname.includes("fb.com") ||
            pathname.includes("/share/v/") ||
            pathname.includes("/watch")
        ) {
            return "facebook";
        }
        if (hostname.includes("tiktok.com")) {
            return "tiktok";
        }

        return "unknown";
    } catch (error) {
        console.error("Error detecting video type:", error);
        return "unknown";
    }
};

// Convert YouTube URL to embeddable format
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
            return url;
        }

        // Add parameters to minimize suggestions and branding
        const params = new URLSearchParams({
            rel: "0",
            modestbranding: "1",
            showinfo: "0",
            iv_load_policy: "3",
            controls: "1",
            disablekb: "0",
            fs: "1",
            playsinline: "1",
            autohide: "1",
            loop: "0",
            playlist: videoId,
        });

        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } catch (error) {
        console.error("Error parsing YouTube URL:", error);
        return url;
    }
};

// Convert Facebook URL to embeddable format
const getFacebookEmbedUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname.toLowerCase();

        // Handle Facebook share links: https://www.facebook.com/share/v/VIDEO_ID/
        if (pathname.includes("/share/v/")) {
            // Extract video ID from share link
            const match = pathname.match(/\/share\/v\/([^/]+)/);
            if (match && match[1]) {
                // Convert share link to watch link format for better embed compatibility
                const videoId = match[1];
                const watchUrl = `https://www.facebook.com/watch?v=${videoId}`;
                const encodedUrl = encodeURIComponent(watchUrl);
                return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=734&t=0`;
            }
        }

        // Handle standard Facebook watch URLs: https://www.facebook.com/watch?v=VIDEO_ID
        if (pathname.includes("/watch") && urlObj.searchParams.has("v")) {
            const encodedUrl = encodeURIComponent(url);
            return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=734&t=0`;
        }

        // For other Facebook URLs, encode the full URL
        const encodedUrl = encodeURIComponent(url);
        return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=734&t=0`;
    } catch (error) {
        console.error("Error parsing Facebook URL:", error);
        return url;
    }
};

// Generate TikTok embed code from URL
const generateTikTokEmbedCode = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        // Extract video ID from URL format: https://www.tiktok.com/@username/video/1234567890
        const videoMatch = pathname.match(/\/video\/(\d+)/);
        const videoId = videoMatch && videoMatch[1] ? videoMatch[1] : null;

        // Extract username from URL
        const usernameMatch = pathname.match(/\/@([^/]+)/);
        const username = usernameMatch && usernameMatch[1] ? usernameMatch[1] : null;

        // Clean URL (remove query parameters for cite attribute)
        const cleanUrl = url.split("?")[0];

        // Build the embed code
        const videoIdAttr = videoId ? `data-video-id="${videoId}"` : "";
        const usernameLink = username
            ? `<a target="_blank" title="@${username}" href="https://www.tiktok.com/@${username}?refer=embed">@${username}</a>`
            : `<a target="_blank" title="TikTok Video" href="${cleanUrl}">TikTok Video</a>`;

        return `<blockquote class="tiktok-embed" cite="${cleanUrl}" ${videoIdAttr} style="max-width: 605px;min-width: 325px;" > <section> ${usernameLink} </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;
    } catch (error) {
        console.error("Error generating TikTok embed code:", error);
        // Fallback embed code
        return `<blockquote class="tiktok-embed" cite="${url}" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="TikTok Video" href="${url}">TikTok Video</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;
    }
};

// Get embed URL based on video type
const getEmbedUrl = (url: string, type: VideoType): string => {
    switch (type) {
        case "youtube":
            return getYouTubeEmbedUrl(url);
        case "facebook":
            return getFacebookEmbedUrl(url);
        default:
            return url;
    }
};

export const UniversalVideoPlayer = ({ url, title = "Video player", className = "" }: UniversalVideoPlayerProps) => {
    const videoType = detectVideoType(url);
    const embedUrl = getEmbedUrl(url, videoType);

    if (videoType === "unknown") {
        return (
            <div className={cn("aspect-video overflow-hidden rounded-xl bg-gray-100 p-4", className)}>
                <div className="flex h-full items-center justify-center text-gray-500">
                    <p>অসমর্থিত ভিডিও ফরম্যাট। অনুগ্রহ করে YouTube, Facebook, বা TikTok লিংক ব্যবহার করুন।</p>
                </div>
            </div>
        );
    }

    // Special rendering for TikTok - use embed code with dangerouslySetInnerHTML
    if (videoType === "tiktok") {
        const embedCode = generateTikTokEmbedCode(url);
        return (
            <div className={cn("overflow-hidden rounded-xl bg-gray-100", className)}>
                <div className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: embedCode }} />
            </div>
        );
    }

    // Standard rendering for YouTube and Facebook
    return (
        <div className={cn("aspect-video overflow-hidden rounded-xl bg-gray-100", className)}>
            <iframe
                src={embedUrl}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                scrolling={videoType === "facebook" ? "no" : undefined}
                style={videoType === "facebook" ? { border: "none", overflow: "hidden" } : undefined}
            />
        </div>
    );
};
