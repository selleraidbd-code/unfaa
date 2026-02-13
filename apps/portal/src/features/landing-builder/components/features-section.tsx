"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Plus, Trash2 } from "lucide-react";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";

export const FeaturesSection = () => {
    const { control } = useFormContext<LandingPageFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "features.items",
    });

    const handleAddFeature = () => {
        append({
            id: crypto.randomUUID?.() ?? Date.now().toString(),
            title: "",
            description: "",
        });
    };

    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <div>
                <h2 className="mb-2 text-lg font-semibold">পণ্যের বিশেষত্ব ও সুবিধা (Features & Benefits)</h2>
                <p className="text-muted-foreground text-sm">
                    Add feature cards with a title and description. Each card can show a number (e.g. #০১, #০২) on the
                    landing page.
                </p>
            </div>

            <div className="space-y-4">
                <CustomFormInput<LandingPageFormValues>
                    control={control}
                    name="features.title"
                    label="Section Title"
                    placeholder="e.g., পণ্যের বিশেষত্ব ও সুবিধা"
                />
                <CustomFormInput<LandingPageFormValues>
                    control={control}
                    name="features.subTitle"
                    label="Section Subtitle (optional)"
                    placeholder="e.g., Product Features & Benefits"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Feature cards</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddFeature} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Feature
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm font-medium">
                                Feature #{String(index + 1).padStart(2, "0")}
                            </span>
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
                            name={`features.items.${index}.title`}
                            label="Feature Title"
                            placeholder="e.g., সাশ্রয়ী মূল্য"
                        />
                        <CustomFormTextarea<LandingPageFormValues>
                            control={control}
                            name={`features.items.${index}.description`}
                            label="Description"
                            placeholder="e.g., আমরা সরাসরি ডিলার থেকে পণ্য সংগ্রহ করি বিধায় বাজারের সেরা মূল্যে পণ্য দিতে সক্ষম।"
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
