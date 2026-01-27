/**
 * Generic tracking utility for all event types
 */

import { config } from "@/config";

import { TrackingEventData, TrackingEventName } from "@/types/tracking-type";

// Helper function to get cookie value by name
function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
    return undefined;
}

// Helper function to get user data from localStorage
function getUserData() {
    if (typeof window === "undefined") return null;

    try {
        const savedForm = localStorage.getItem("checkout_form");
        if (savedForm) {
            const parsedForm = JSON.parse(savedForm);
            const nameParts = (parsedForm.name || "").trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            return {
                phone: parsedForm.phone,
                first_name: firstName,
                last_name: lastName,
                email: parsedForm.email,
            };
        }
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
    }

    return null;
}

/**
 * Get client IP address (if available from headers or other sources)
 * Note: In client-side code, we can't directly get IP, but this can be populated server-side
 */
function getClientIpAddress(): string | undefined {
    // Client-side can't get IP directly, but this can be set by server-side code
    // or passed from server components
    return undefined;
}

/**
 * Build user_data object with all available information
 */
export function buildUserData(): TrackingEventData["user_data"] {
    const userData = getUserData();
    const fbc = getCookie("_fbc");
    const fbp = getCookie("_fbp");

    return {
        email: userData?.email,
        phone: userData?.phone,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        city: undefined, // Can be added if available
        state: undefined, // Can be added if available
        zip: undefined, // Can be added if available
        country: undefined, // Can be added if available
        external_id: undefined, // Can be set if available
        client_ip_address: getClientIpAddress(),
        client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        fbc: fbc,
        fbp: fbp,
    };
}

/**
 * Track event to backend API
 */
export async function trackEventToBackend(
    eventName: TrackingEventName,
    data: Omit<TrackingEventData, "event_name" | "user_data"> & {
        user_data?: Partial<TrackingEventData["user_data"]>;
    },
    shopSlug: string
): Promise<void> {
    if (!config.serverUrl) {
        console.warn("⚠️ Server URL not configured");
        return;
    }

    try {
        // Build complete user_data with defaults
        const userData = {
            ...buildUserData(),
            ...data.user_data, // Override with provided user_data
        };

        const eventData: TrackingEventData = {
            event_name: eventName,
            content_name: data.content_name,
            content_category: data.content_category,
            content_ids: data.content_ids,
            content_type: data.content_type,
            value: data.value,
            currency: data.currency,
            event_id: data.event_id,
            external_id: data.external_id,
            user_data: userData,
        };

        // Determine endpoint based on event type
        // Convert event name to kebab-case (e.g., "InitiateCheckout" -> "initiate-checkout", "ViewContent" -> "view-content")
        const endpoint = eventName
            .replace(/([a-z])([A-Z])/g, "$1-$2") // Add dash before capital letters (but not before first char)
            .toLowerCase();
        const url = `${config.serverUrl}/extranal-tracking/view-content/${shopSlug}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({  ...eventData }),
        });

        if (!response.ok) {
            throw new Error(`Backend tracking failed: ${response.status} ${response.statusText}`);
        }

        console.log(`✅ Backend ${eventName} tracked:`, {
            event_id: eventData.event_id,
            content_name: eventData.content_name,
        });
    } catch (error) {
        console.error(`❌ Error tracking ${eventName} to backend:`, error);
    }
}

/**
 * Track Facebook Pixel event
 */
export function trackFacebookPixel(
    eventName: TrackingEventName,
    params: {
        content_ids?: string[];
        content_type?: string;
        content_name?: string;
        content_category?: string;
        value?: number;
        currency?: string;
        [key: string]: unknown;
    }
): void {
    if (typeof window === "undefined" || !window.fbq) {
        return;
    }

    window.fbq("track", eventName, params);
    console.log(`✅ Facebook ${eventName} tracked:`, params);
}

/**
 * Track TikTok Pixel event
 */
export function trackTikTokPixel(
    eventName: string,
    params: {
        content_id?: string;
        content_ids?: string[];
        content_type?: string;
        content_name?: string;
        content_category?: string;
        value?: number;
        price?: number;
        currency?: string;
        [key: string]: unknown;
    }
): void {
    if (typeof window === "undefined" || !window.ttq) {
        return;
    }

    window.ttq.track(eventName, params);
    console.log(`✅ TikTok ${eventName} tracked:`, params);
}
