const getUrlWithQueryParams = (
    basePath: string,
    params: Record<string, string | number | boolean | undefined> = {}
) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
};

export { getUrlWithQueryParams };
