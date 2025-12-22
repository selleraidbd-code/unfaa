export const isValidId = (value: unknown): boolean => {
    if (typeof value !== "string") return false;

    const trimmed = value.trim();
    if (trimmed.length === 0) return false;

    // Common bad input from upstream like: "customerId is undefined"
    if (/undefined/i.test(trimmed)) return false;

    // UUID v1–v5 format check (8-4-4-4-12 hex, with proper variant/version bits)
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(trimmed);
};

// Validate Bangladesh phone numbers
export const isValidBdPhoneNumber = (rawPhone: string) => {
    const digitsOnly = rawPhone.replace(/\D/g, "");
    // Normalize to local format if starts with 880 (e.g., +8801XXXXXXXXX or 8801XXXXXXXXX)
    let localFormat = digitsOnly;
    if (localFormat.startsWith("880") && localFormat.length >= 12) {
        localFormat = "0" + localFormat.slice(3);
    }
    // Valid local format: 11 digits, starts with 01, next digit 3-9
    return /^01[3-9]\d{8}$/.test(localFormat);
};
