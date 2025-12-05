import { useCallback, useEffect, useRef } from "react";

import { ProductFormType } from "@/features/products/create/variant-card";
import { toast } from "@workspace/ui/components/sonner";
import { UseFormReturn } from "react-hook-form";

import { clearDraft, loadDraft, saveDraft } from "@/lib/product-draft-utils";

interface UseProductDraftOptions {
    form: UseFormReturn<ProductFormType>;
    onDraftLoaded?: () => void;
    silentAutoSave?: boolean;
}

/**
 * Custom hook for managing product draft functionality
 * Handles saving, loading, and auto-saving draft data
 */
export const useProductDraft = ({ form, onDraftLoaded, silentAutoSave = true }: UseProductDraftOptions) => {
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedRef = useRef<string>("");

    /**
     * Saves the current form data as a draft
     */
    const handleSaveDraft = useCallback(() => {
        const formValues = form.getValues();
        const success = saveDraft(formValues);

        if (success) {
            lastSavedRef.current = JSON.stringify(formValues);
            toast.success("Draft saved successfully");
        } else {
            toast.error("Failed to save draft");
        }
    }, [form]);

    /**
     * Auto-saves draft without showing notification
     */
    const handleAutoSave = useCallback(
        (formValues: ProductFormType) => {
            const currentData = JSON.stringify(formValues);

            // Skip if data hasn't changed
            if (currentData === lastSavedRef.current) {
                return;
            }

            const success = saveDraft(formValues);
            if (success) {
                lastSavedRef.current = currentData;
                if (!silentAutoSave) {
                    toast.success("Draft auto-saved");
                }
            }
        },
        [silentAutoSave]
    );

    /**
     * Debounced auto-save for editor content
     */
    const handleDebouncedAutoSave = useCallback(
        (formValues: ProductFormType) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                handleAutoSave(formValues);
            }, 500);
        },
        [handleAutoSave]
    );

    /**
     * Loads draft data into the form
     */
    const handleLoadDraft = useCallback(() => {
        const draft = loadDraft();
        if (draft) {
            form.reset(draft);
            lastSavedRef.current = JSON.stringify(draft);
            toast.success("Draft loaded");
            onDraftLoaded?.();
        }
    }, [form, onDraftLoaded]);

    /**
     * Clears the draft from localStorage
     */
    const handleClearDraft = useCallback(() => {
        clearDraft();
        lastSavedRef.current = "";
    }, []);

    /**
     * Cleanup debounce timer on unmount
     */
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        saveDraft: handleSaveDraft,
        autoSave: handleAutoSave,
        debouncedAutoSave: handleDebouncedAutoSave,
        loadDraft: handleLoadDraft,
        clearDraft: handleClearDraft,
    };
};
