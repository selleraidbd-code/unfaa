"use client";

import { useEffect, useState } from "react";

import { useUpdatePackageMutation } from "@/redux/api/package-api";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/sonner";

import { Package } from "@/types/package-type";
import { CustomButton } from "@/components/ui/custom-button";

type EditPackageDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    package: Package | null;
    onSuccess?: () => void;
};

export const EditPackageDialog = ({ open, onOpenChange, package: pkg, onSuccess }: EditPackageDialogProps) => {
    const [packageTitle, setPackageTitle] = useState("");
    const [codAmount, setCodAmount] = useState<number>(0);

    const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

    // Initialize form when package changes
    useEffect(() => {
        if (pkg) {
            setPackageTitle(pkg.title);
            setCodAmount(pkg.codAmount);
        }
    }, [pkg]);

    const handleUpdatePackage = async () => {
        if (!pkg) return;

        if (!packageTitle.trim()) {
            toast.error("Please enter a package title");
            return;
        }

        const payload = {
            title: packageTitle,
            codAmount: codAmount,
        };

        await updatePackage({ id: pkg.id, payload })
            .unwrap()
            .then(() => {
                toast.success("Package updated successfully");
                onOpenChange(false);
                onSuccess?.();
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Failed to update package");
            });
    };

    const handleClose = (open: boolean) => {
        onOpenChange(open);
        if (!open && pkg) {
            // Reset to original values when closing
            setPackageTitle(pkg.title);
            setCodAmount(pkg.codAmount);
        }
    };

    if (!pkg) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="flex max-h-[90vh] flex-col overflow-y-auto lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Package</DialogTitle>
                    <DialogDescription>Update package title and COD amount</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <CustomInput
                        label="Package Title"
                        placeholder="e.g., Summer Sale Package"
                        value={packageTitle}
                        onChange={(value) => setPackageTitle(String(value))}
                        required
                    />

                    <CustomInput
                        label="COD Amount"
                        placeholder="0"
                        type="number"
                        value={codAmount}
                        onChange={(value) => setCodAmount(Number(value) || 0)}
                        required
                    />
                </div>

                <DialogFooter>
                    <CustomButton variant="outline" onClick={() => handleClose(false)}>
                        Cancel
                    </CustomButton>
                    <CustomButton onClick={handleUpdatePackage} disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Update Package"}
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
