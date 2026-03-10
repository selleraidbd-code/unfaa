const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBengaliNumber = (n: number) =>
    String(n)
        .padStart(2, "0")
        .split("")
        .map((c) => BENGALI_DIGITS[parseInt(c, 10)])
        .join("");

const ensureCountryCode = (phone: string): string => {
    const digits = phone.replace(/[^0-9+]/g, "");
    if (digits.startsWith("+")) return digits;
    if (digits.startsWith("880")) return `+${digits}`;
    if (digits.startsWith("0")) return `+880${digits.slice(1)}`;
    return `+880${digits}`;
};

export { toBengaliNumber, ensureCountryCode };
