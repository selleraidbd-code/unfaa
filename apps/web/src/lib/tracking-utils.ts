// Import and re-export formatPhoneNumber from phone-number-utils for backward compatibility
import { formatPhoneNumber } from "./format-number-utils";

/**
 * Utility functions for collecting tracking data from various sources
 */

export type TrackingData = {
    fbp?: string; // Facebook browser ID
    fbc?: string; // Facebook click ID
    eventId?: string;
    ttclid?: string; // TikTok click ID
    ttp?: string; // TikTok pixel parameter
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    utmId?: string;
    fbclid?: string; // Facebook click ID (alternative)
    phRaw?: string; // Phone number raw
    phHashed?: string; // Phone number hashed
    emailHashed?: string;
    pageUrl?: string;
    referrerUrl?: string;
};

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
    return undefined;
}

/**
 * Get URL parameter from current URL
 */
function getUrlParam(name: string): string | undefined {
    if (typeof window === "undefined") return undefined;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || undefined;
}

/**
 * Get URL parameter from a specific URL string
 */
function getUrlParamFromString(url: string, name: string): string | undefined {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(name) || undefined;
    } catch {
        return undefined;
    }
}

/**
 * Collect all tracking data from cookies, URL parameters, and other sources
 * @param phoneNumber - Optional phone number to include in phRaw field
 */
export function collectTrackingData(phoneNumber?: string): TrackingData | null {
    if (typeof window === "undefined") return null;

    const trackingData: TrackingData = {};

    // Include phone number if provided (normalized without country code)
    if (phoneNumber && phoneNumber.trim()) {
        trackingData.phRaw = formatPhoneNumber(phoneNumber.trim());
    }

    // Get Facebook Pixel data from cookies
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");
    if (fbp) trackingData.fbp = fbp;
    if (fbc) trackingData.fbc = fbc;

    // Get TikTok click ID from URL or cookie
    const ttclid = getUrlParam("ttclid") || getCookie("_ttclid");
    if (ttclid) trackingData.ttclid = ttclid;

    // Get TikTok pixel parameter
    const ttp = getUrlParam("ttp");
    if (ttp) trackingData.ttp = ttp;

    // Get UTM parameters from URL
    const utmSource = getUrlParam("utm_source");
    const utmMedium = getUrlParam("utm_medium");
    const utmCampaign = getUrlParam("utm_campaign");
    const utmContent = getUrlParam("utm_content");
    const utmTerm = getUrlParam("utm_term");
    const utmId = getUrlParam("utm_id");
    if (utmSource) trackingData.utmSource = utmSource;
    if (utmMedium) trackingData.utmMedium = utmMedium;
    if (utmCampaign) trackingData.utmCampaign = utmCampaign;
    if (utmContent) trackingData.utmContent = utmContent;
    if (utmTerm) trackingData.utmTerm = utmTerm;
    if (utmId) trackingData.utmId = utmId;

    // Get Facebook click ID from URL
    const fbclid = getUrlParam("fbclid");
    if (fbclid) trackingData.fbclid = fbclid;

    // Get event ID from sessionStorage (if set by tracking pixels)
    const eventId = sessionStorage.getItem("last_event_id");
    if (eventId) trackingData.eventId = eventId;

    // Get current page URL
    trackingData.pageUrl = window.location.href;

    // Get referrer URL
    if (document.referrer) {
        trackingData.referrerUrl = document.referrer;

        // Also check referrer URL for tracking parameters that might not be in current URL
        if (!trackingData.fbclid) {
            const refFbclid = getUrlParamFromString(document.referrer, "fbclid");
            if (refFbclid) trackingData.fbclid = refFbclid;
        }
        if (!trackingData.ttclid) {
            const refTtclid = getUrlParamFromString(document.referrer, "ttclid");
            if (refTtclid) trackingData.ttclid = refTtclid;
        }
    }

    // Get phone/email hashed data from localStorage if available
    // These would typically be set by tracking scripts
    try {
        const trackingStorage = localStorage.getItem("tracking_data");
        if (trackingStorage) {
            const parsed = JSON.parse(trackingStorage);
            if (parsed.phRaw) trackingData.phRaw = parsed.phRaw;
            if (parsed.phHashed) trackingData.phHashed = parsed.phHashed;
            if (parsed.emailHashed) trackingData.emailHashed = parsed.emailHashed;
        }
    } catch (error) {
        console.error("Error parsing tracking data from localStorage:", error);
    }

    // Only return if we have at least one tracking parameter
    const hasTrackingData = Object.keys(trackingData).length > 0;
    return hasTrackingData ? trackingData : null;
}
