"use client";

import { Editor } from "@/components/editor";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { useState, useMemo } from "react";
import { toast } from "@workspace/ui/components/sonner";

interface AboutUsPolicyProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    isSaving: boolean;
}

export const AboutUsPolicy = ({
    initialContent,
    onSave,
    isSaving,
}: AboutUsPolicyProps) => {
    const [aboutUs, setAboutUs] = useState(initialContent);

    // Calculate hasChanges directly - no need for state
    const hasChanges = useMemo(() => {
        return aboutUs !== initialContent;
    }, [aboutUs, initialContent]);

    const handleSave = async () => {
        if (!aboutUs.trim() || !hasChanges) return;

        try {
            await onSave(aboutUs);
            toast.success("About Us saved successfully");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to save About Us");
        }
    };

    return (
        <CustomCollapsible
            title="About Us"
            content={
                <div className="flex flex-col gap-6">
                    <Editor content={aboutUs} onChange={setAboutUs} />
                    <CustomButton
                        className="ms-auto"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!aboutUs.trim() || !hasChanges}
                    >
                        Save About Us
                    </CustomButton>
                </div>
            }
        />
    );
};
