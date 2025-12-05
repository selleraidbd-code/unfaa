import { cn } from "@workspace/ui/lib/utils";
import { UseFormReturn } from "react-hook-form";

import { CustomButton } from "@/components/ui/custom-button";

import { ProductFormType } from "./variant-card";

interface DiscardAndSaveButtonProps {
    form: UseFormReturn<ProductFormType>;
    isCreating: boolean;
    className?: string;
    onSaveDraft?: () => void;
}

export const DiscardAndSaveButton = ({ form, isCreating, className, onSaveDraft }: DiscardAndSaveButtonProps) => {
    return (
        <div className={cn("items-center gap-2", className)}>
            <CustomButton
                href="/products"
                variant="outline"
                type="button"
                disabled={form.formState.isSubmitting || isCreating}
            >
                Discard
            </CustomButton>
            {onSaveDraft && (
                <CustomButton
                    variant="outline"
                    type="button"
                    onClick={onSaveDraft}
                    disabled={form.formState.isSubmitting || isCreating}
                >
                    Save Draft
                </CustomButton>
            )}
            <CustomButton isLoading={isCreating || form.formState.isSubmitting} type="submit">
                Save Product
            </CustomButton>
        </div>
    );
};
