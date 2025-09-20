"use server";

import config from "@/config";

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
    formData?: boolean;
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
}

export const CustomFetch = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T | undefined> => {
    const url: string = `${config.serverUrl}${endpoint}`;

    const { next, formData, ...fetchOptions } = options;

    const finalOptions: RequestInit = {
        ...fetchOptions,
        headers: {
            ...fetchOptions.headers,
            ...(!formData &&
            (!fetchOptions.headers || !("Content-Type" in fetchOptions.headers))
                ? { "Content-Type": "application/json" }
                : {}),
        },
        ...(next && { next }),
    };

    const response = await fetch(url, finalOptions);
    if (response.status === 204) return;

    const body = await response.json();

    if (response.ok) {
        return body;
    } else {
        throw new Error(JSON.stringify(body));
    }
};
