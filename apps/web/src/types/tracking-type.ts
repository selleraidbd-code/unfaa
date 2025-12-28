export interface ViewContentEventsData {
    event_id?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
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
