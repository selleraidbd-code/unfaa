"use client";

import { Suspense } from "react";

import { FacebookPixel } from "./facebook-pixel";
import { TikTokPixel } from "./tiktok-pixel";

interface TrackingPixelsProps {
    facebookPixelId?: string;
    tiktokPixelId?: string;
}

function TrackingPixelsContent({ facebookPixelId, tiktokPixelId }: TrackingPixelsProps) {
    const validFacebookPixelId = facebookPixelId?.trim();
    const validTiktokPixelId = tiktokPixelId?.trim();

    return (
        <>
            {validFacebookPixelId && <FacebookPixel pixelId={validFacebookPixelId} />}
            {validTiktokPixelId && <TikTokPixel pixelId={validTiktokPixelId} />}
        </>
    );
}

export function TrackingPixels({ facebookPixelId, tiktokPixelId }: TrackingPixelsProps) {
    return (
        <Suspense fallback={null}>
            <TrackingPixelsContent facebookPixelId={facebookPixelId} tiktokPixelId={tiktokPixelId} />
        </Suspense>
    );
}
