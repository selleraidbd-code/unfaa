"use client";

import { Editor } from "@/components/editor";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { useState, useMemo } from "react";
import { toast } from "@workspace/ui/components/sonner";

interface TermsConditionsPolicyProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    isSaving: boolean;
}

export const TermsConditionsPolicy = ({
    initialContent,
    onSave,
    isSaving,
}: TermsConditionsPolicyProps) => {
    const [termsAndConditions, setTermsAndConditions] =
        useState(initialContent);

    // Calculate hasChanges directly - no need for state
    const hasChanges = useMemo(() => {
        return termsAndConditions !== initialContent;
    }, [termsAndConditions, initialContent]);

    const handleSave = async () => {
        if (!termsAndConditions.trim() || !hasChanges) return;

        try {
            await onSave(termsAndConditions);
            toast.success("Terms and Conditions saved successfully");
        } catch (error: any) {
            toast.error(
                error.data?.message || "Failed to save Terms and Conditions"
            );
        }
    };

    return (
        <CustomCollapsible
            title="Terms and Conditions"
            content={
                <div className="flex flex-col gap-6">
                    <Editor
                        content={termsAndConditions}
                        onChange={setTermsAndConditions}
                    />
                    <CustomButton
                        className="ms-auto"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!termsAndConditions.trim() || !hasChanges}
                    >
                        Save Terms and Conditions
                    </CustomButton>
                </div>
            }
        />
    );
};
