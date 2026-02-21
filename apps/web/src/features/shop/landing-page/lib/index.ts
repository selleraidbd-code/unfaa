const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBengaliNumber = (n: number) =>
    String(n)
        .padStart(2, "0")
        .split("")
        .map((c) => BENGALI_DIGITS[parseInt(c, 10)])
        .join("");

export { toBengaliNumber };
