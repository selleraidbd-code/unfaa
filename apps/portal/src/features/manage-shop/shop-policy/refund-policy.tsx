"use client";

import { Editor } from "@/components/editor";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { useState, useMemo } from "react";
import { toast } from "@workspace/ui/components/sonner";

interface RefundPolicyProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    isSaving: boolean;
}

export const RefundPolicy = ({
    initialContent,
    onSave,
    isSaving,
}: RefundPolicyProps) => {
    const [refundPolicy, setRefundPolicy] = useState(initialContent);

    // Calculate hasChanges directly - no need for state
    const hasChanges = useMemo(() => {
        return refundPolicy !== initialContent;
    }, [refundPolicy, initialContent]);

    const handleSave = async () => {
        if (!refundPolicy.trim() || !hasChanges) return;

        try {
            await onSave(refundPolicy);
            toast.success("Refund Policy saved successfully");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to save Refund Policy");
        }
    };

    return (
        <CustomCollapsible
            title="Refund Policy"
            content={
                <div className="flex flex-col gap-6">
                    <Editor content={refundPolicy} onChange={setRefundPolicy} />
                    <CustomButton
                        className="ms-auto"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!refundPolicy.trim() || !hasChanges}
                    >
                        Save Refund Policy
                    </CustomButton>
                </div>
            }
        />
    );
};
