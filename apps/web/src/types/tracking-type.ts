export type TrackingEventName =
    | "ViewContent"
    | "AddToCart"
    | "Purchase"
    | "InitiateCheckout"
    | "AddPaymentInfo"
    | "Lead"
    | "CompleteRegistration";

export interface TrackingEventData {
    event_id?: string;
    external_id?: string;
    event_name: TrackingEventName;
    content_name: string;
    content_category: string;
    content_ids: string[];
    content_type: string;
    value: number;
    currency: string;
    user_data: {
        email?: string;
        phone?: string;
        first_name?: string;
        last_name?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        external_id?: string;
        client_ip_address?: string;
        client_user_agent?: string;
        fbc?: string; // Facebook click ID
        fbp?: string; // Facebook browser ID
    };
}

// Legacy type for backward compatibility
export interface ViewContentEventsData extends Omit<TrackingEventData, "event_name"> {
    event_name?: TrackingEventName;
}
