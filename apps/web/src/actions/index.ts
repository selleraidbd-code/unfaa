"use server";

import { config } from "@/config";

type ApiRequestInit = RequestInit & {
    next?: NextFetchRequestConfig;
};

async function apiFetch(
    endpoint: RequestInfo | URL,
    init?: ApiRequestInit
): Promise<Response> {
    // Handle URL construction - support both absolute and relative URLs
    const url =
        typeof endpoint === "string" && !endpoint.startsWith("http")
            ? `${config.serverUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`
            : endpoint;

    // Initialize request options with defaults
    const options: ApiRequestInit = { ...init };

    // Set up headers if not provided
    options.headers = options.headers || {};
    const headers = new Headers(options.headers);

    // Handle body JSON stringification
    if (
        options.body &&
        typeof options.body === "object" &&
        !(options.body instanceof FormData) &&
        !(options.body instanceof URLSearchParams) &&
        !(options.body instanceof Blob) &&
        !(options.body instanceof ArrayBuffer)
    ) {
        options.body = JSON.stringify(options.body);

        // Set Content-Type to application/json if not already set
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
    }

    // Make the fetch request
    return fetch(url, options);
}

/**
 * JSON fetch helper with authentication and error handling
 * Properly handles 204 No Content responses
 */
async function fetchJSON<T = unknown>(
    endpoint: RequestInfo | URL,
    init?: ApiRequestInit
): Promise<T> {
    const response = await apiFetch(endpoint, init);

    // Handle error responses
    if (!response.ok) {
        let errorData: Record<string, unknown> = {};

        try {
            errorData = await response.json();
        } catch (e) {
            // If response can't be parsed as JSON, use statusText
            console.error(e);
        }

        const error = new Error(
            (typeof errorData.detail === "string"
                ? errorData.detail
                : undefined) ||
                `API error: ${response.status} ${response.statusText}`
        ) as Error & {
            status?: number;
            data?: Record<string, unknown>;
        };

        error.status = response.status;
        error.data = errorData;

        throw error;
    }

    // Handle 204 No Content responses - return empty object instead of parsing JSON
    if (response.status === 204) {
        return {} as T;
    }

    // For other successful responses, parse as JSON
    return (await response.json()) as T;
}

/**
 * HTTP method shortcuts
 */
export const api = {
    async get<T = unknown>(
        endpoint: string,
        options?: Omit<ApiRequestInit, "method" | "body">
    ): Promise<T> {
        return fetchJSON<T>(endpoint, { ...options, method: "GET" });
    },

    async post<T = unknown>(
        endpoint: string,
        body?: BodyInit | Record<string, unknown> | null,
        options?: Omit<ApiRequestInit, "method">
    ): Promise<T> {
        return fetchJSON<T>(endpoint, {
            ...options,
            method: "POST",
            body: body as BodyInit,
        });
    },

    async put<T = unknown>(
        endpoint: string,
        body?: BodyInit | Record<string, unknown> | null,
        options?: Omit<ApiRequestInit, "method">
    ): Promise<T> {
        return fetchJSON<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body as BodyInit,
        });
    },

    async patch<T = unknown>(
        endpoint: string,
        body?: BodyInit | Record<string, unknown> | null,
        options?: Omit<ApiRequestInit, "method">
    ): Promise<T> {
        return fetchJSON<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: body as BodyInit,
        });
    },

    async delete<T = unknown>(
        endpoint: string,
        options?: Omit<ApiRequestInit, "method">
    ): Promise<T> {
        return fetchJSON<T>(endpoint, { ...options, method: "DELETE" });
    },
};
