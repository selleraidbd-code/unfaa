"use client";

import { useState } from "react";

import { useUpdateShopSectionCoreMutation } from "@/redux/api/shop-theme-api";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { Textarea } from "@workspace/ui/components/textarea";

import { ShopSection } from "@/types/shop-type";

interface EditSectionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    section: ShopSection;
}

export const EditSectionDialog = ({ open, setOpen, section }: EditSectionDialogProps) => {
    const [title, setTitle] = useState(section.title);
    const [description, setDescription] = useState(section.description);

    const [updateShopSectionCore, { isLoading }] = useUpdateShopSectionCoreMutation();

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        await updateShopSectionCore({
            sectionId: section.id,
            payload: {
                title,
                description,
            },
        })
            .unwrap()
            .then(() => {
                toast.success("Section updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Something went wrong");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Section</DialogTitle>
                    <DialogDescription>Update the section title and description.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter section title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter section description"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
