"use client";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

const FEATURES_LIST_ACCORDION_VALUE = "features-list-section";

export const FeaturesListSection = () => {
    const { control } = useFormContext<LandingPageFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "featuresListSection.items",
    });

    const handleAddItem = () => {
        append({
            id: crypto.randomUUID?.() ?? Date.now().toString(),
            text: "",
        });
    };

    return (
        <Accordion type="single" collapsible className="bg-card rounded-lg border">
            <AccordionItem value={FEATURES_LIST_ACCORDION_VALUE} className="border-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6 lg:py-5">
                    <div className="flex flex-col items-start gap-0.5 text-left">
                        <span className="text-lg font-semibold">Features List Section</span>
                        <span className="text-muted-foreground text-sm font-normal">
                            Add a title, description, and a simple list of feature points
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-0 pb-4 lg:px-6 lg:pb-6">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-4">
                            <CustomFormInput<LandingPageFormValues>
                                control={control}
                                name="featuresListSection.title"
                                label="Section Title"
                                placeholder="e.g., Key Features"
                            />
                            <CustomFormTextarea<LandingPageFormValues>
                                control={control}
                                name="featuresListSection.description"
                                label="Description (optional)"
                                placeholder="Briefly describe what makes this product stand out..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Feature Items</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddItem}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Feature
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <span className="text-muted-foreground mt-1 shrink-0 text-sm font-medium">
                                        {String(index + 1).padStart(2, "0")}.
                                    </span>
                                    <div className="flex-1">
                                        <CustomFormInput<LandingPageFormValues>
                                            control={control}
                                            name={`featuresListSection.items.${index}.text`}
                                            label=""
                                            placeholder={`Feature ${index + 1}...`}
                                        />
                                    </div>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="text-destructive hover:text-destructive mt-1 h-8 w-8 shrink-0 p-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
