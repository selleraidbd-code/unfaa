/**
 * Convert Bengali (Bangla) digits to English digits
 * @param str - String that may contain Bengali digits
 * @returns String with Bengali digits converted to English digits
 */
function convertBengaliToEnglish(str: string): string {
    const bengaliToEnglish: { [key: string]: string } = {
        "০": "0",
        "১": "1",
        "২": "2",
        "৩": "3",
        "৪": "4",
        "৫": "5",
        "৬": "6",
        "৭": "7",
        "৮": "8",
        "৯": "9",
    };

    return str.replace(/[০-৯]/g, (char) => bengaliToEnglish[char] || char);
}

/**
 * Format phone number by removing all non-digit characters (except + for country code detection)
 * Removes country code (+880) if present and ensures the number starts with 0
 * Supports both English and Bengali (Bangla) digits
 * @param phoneNumber - Phone number to format (e.g., "*01-716+889-44" or "০১৭+১৩৬-৮৮৯*৪৪" becomes "0171688944")
 * @returns Formatted phone number without country code, starting with 0
 */
export function formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return phoneNumber;

    // Convert Bengali digits to English digits first
    let temp = convertBengaliToEnglish(phoneNumber.trim());

    // First, check for country code before removing all non-digits
    // This preserves the + for country code detection
    // Also check for Bengali country codes that were converted
    let hasCountryCode = false;

    if (temp.startsWith("+880")) {
        hasCountryCode = true;
        temp = temp.substring(4);
    } else if (temp.startsWith("880")) {
        hasCountryCode = true;
        temp = temp.substring(3);
    }

    // Remove all non-digit characters (spaces, dashes, asterisks, plus signs, etc.)
    let normalized = temp.replace(/\D/g, "");

    // If we detected a country code, we've already removed it
    // Otherwise, check if the normalized number starts with 880 or 80
    if (!hasCountryCode) {
        if (normalized.startsWith("880")) {
            normalized = normalized.substring(3);
        } else if (normalized.startsWith("80")) {
            normalized = normalized.substring(2);
        }
    }

    // Ensure the number starts with 0 (Bangladesh mobile number format)
    if (normalized && !normalized.startsWith("0")) {
        normalized = "0" + normalized;
    }

    return normalized;
}
