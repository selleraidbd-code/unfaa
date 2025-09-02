"use server";

import config from "@/config";

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
    formData?: boolean;
}

export const CustomFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T | undefined> => {
    const url: string = `${config.serverUrl}${endpoint}`;

    options = {
        ...options,
        headers: {
            ...options.headers,
            ...(!options.formData && (!options.headers || !("Content-Type" in options.headers))
                ? { "Content-Type": "application/json" }
                : {}),
        },
    };

    const response = await fetch(url, options);
    if (response.status === 204) return;

    const body = await response.json();

    if (response.ok) {
        return body;
    } else {
        throw new Error(JSON.stringify(body));
    }
};
