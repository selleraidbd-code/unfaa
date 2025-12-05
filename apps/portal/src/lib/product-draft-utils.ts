import { ProductFormType } from "@/features/products/create/variant-card";

const DRAFT_STORAGE_KEY = "product-create-draft";

/**
 * Saves product form data to localStorage as a draft
 * @param data - The product form data to save
 * @returns true if saved successfully, false otherwise
 */
export const saveDraft = (data: ProductFormType): boolean => {
    try {
        if (typeof window === "undefined") {
            return false;
        }

        const serialized = JSON.stringify(data);
        localStorage.setItem(DRAFT_STORAGE_KEY, serialized);
        return true;
    } catch (error) {
        // Handle quota exceeded or other localStorage errors
        console.error("Failed to save draft:", error);
        return false;
    }
};

/**
 * Loads product form data from localStorage draft
 * @returns The draft data if exists, null otherwise
 */
export const loadDraft = (): ProductFormType | null => {
    try {
        if (typeof window === "undefined") {
            return null;
        }

        const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!draft) {
            return null;
        }

        const parsed = JSON.parse(draft) as ProductFormType;

        // Basic validation - ensure it has the expected structure
        if (typeof parsed === "object" && parsed !== null) {
            return parsed;
        }

        return null;
    } catch (error) {
        // Handle corrupted data or parse errors
        console.error("Failed to load draft:", error);
        // Clear corrupted draft
        clearDraft();
        return null;
    }
};

/**
 * Removes the draft from localStorage
 */
export const clearDraft = (): void => {
    try {
        if (typeof window === "undefined") {
            return;
        }

        localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear draft:", error);
    }
};

/**
 * Checks if a draft exists in localStorage
 * @returns true if draft exists, false otherwise
 */
export const hasDraft = (): boolean => {
    try {
        if (typeof window === "undefined") {
            return false;
        }

        return localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
    } catch (error) {
        console.error("Failed to check draft:", error);
        return false;
    }
};
