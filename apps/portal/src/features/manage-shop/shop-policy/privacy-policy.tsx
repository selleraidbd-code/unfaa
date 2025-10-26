"use client";

import { Editor } from "@/components/editor";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { useState, useMemo } from "react";
import { toast } from "@workspace/ui/components/sonner";

interface PrivacyPolicyProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    isSaving: boolean;
}

export const PrivacyPolicy = ({
    initialContent,
    onSave,
    isSaving,
}: PrivacyPolicyProps) => {
    const [privacyPolicy, setPrivacyPolicy] = useState(initialContent);

    // Calculate hasChanges directly - no need for state
    const hasChanges = useMemo(() => {
        return privacyPolicy !== initialContent;
    }, [privacyPolicy, initialContent]);

    const handleSave = async () => {
        if (!privacyPolicy.trim() || !hasChanges) return;

        try {
            await onSave(privacyPolicy);
            toast.success("Privacy Policy saved successfully");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to save Privacy Policy");
        }
    };

    return (
        <CustomCollapsible
            title="Privacy Policy"
            content={
                <div className="flex flex-col gap-6">
                    <Editor
                        content={privacyPolicy}
                        onChange={setPrivacyPolicy}
                    />
                    <CustomButton
                        className="ms-auto"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!privacyPolicy.trim() || !hasChanges}
                    >
                        Save Privacy Policy
                    </CustomButton>
                </div>
            }
        />
    );
};
