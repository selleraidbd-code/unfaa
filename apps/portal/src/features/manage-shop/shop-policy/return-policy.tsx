"use client";

import { Editor } from "@/components/editor";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { useState, useMemo } from "react";
import { toast } from "@workspace/ui/components/sonner";

interface ReturnPolicyProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    isSaving: boolean;
}

export const ReturnPolicy = ({
    initialContent,
    onSave,
    isSaving,
}: ReturnPolicyProps) => {
    const [returnPolicy, setReturnPolicy] = useState(initialContent);

    // Calculate hasChanges directly - no need for state
    const hasChanges = useMemo(() => {
        return returnPolicy !== initialContent;
    }, [returnPolicy, initialContent]);

    const handleSave = async () => {
        if (!returnPolicy.trim() || !hasChanges) return;

        try {
            await onSave(returnPolicy);
            toast.success("Return Policy saved successfully");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to save Return Policy");
        }
    };

    return (
        <CustomCollapsible
            title="Return Policy"
            content={
                <div className="flex flex-col gap-6">
                    <Editor content={returnPolicy} onChange={setReturnPolicy} />
                    <CustomButton
                        className="ms-auto"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!returnPolicy.trim() || !hasChanges}
                    >
                        Save Return Policy
                    </CustomButton>
                </div>
            }
        />
    );
};
