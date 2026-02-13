"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Plus, Trash2 } from "lucide-react";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";

export const AboutSection = () => {
    const { control } = useFormContext<LandingPageFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "about.items",
    });

    const handleAddItem = () => {
        append({
            id: crypto.randomUUID?.() ?? Date.now().toString(),
            title: "",
            description: "",
        });
    };

    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <div>
                <h2 className="mb-2 text-lg font-semibold">আমাদের সার্ভিস কেন সেরা? (About / Why us)</h2>
                <p className="text-muted-foreground text-sm">
                    Left side: list of benefits (title + description). Right side: video or image URL (imgURL).
                </p>
            </div>

            <div className="space-y-4">
                <CustomFormInput<LandingPageFormValues>
                    control={control}
                    name="about.title"
                    label="Section Title"
                    placeholder="e.g., আমাদের সার্ভিস কেন সেরা?"
                />
                <CustomFormInput<LandingPageFormValues>
                    control={control}
                    name="about.subTitle"
                    label="Section Subtitle (optional)"
                    placeholder="e.g., Why our service is the best?"
                />
            </div>

            <CustomFormInput<LandingPageFormValues>
                control={control}
                name="about.imgURL"
                label="Right side video / image URL (imgURL)"
                placeholder="e.g., https://example.com/image.jpg or embed HTML"
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Left side list (benefits)</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add item
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm font-medium">Item {index + 1}</span>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <CustomFormInput<LandingPageFormValues>
                            control={control}
                            name={`about.items.${index}.title`}
                            label="Title"
                            placeholder="e.g., অরিজিনাল প্রোডাক্ট গ্যারান্টি"
                        />
                        <CustomFormTextarea<LandingPageFormValues>
                            control={control}
                            name={`about.items.${index}.description`}
                            label="Description"
                            placeholder="e.g., সরাসরি আমদানিকারক থেকে সংগৃহীত জেনুইন পণ্য।"
                            rows={2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
