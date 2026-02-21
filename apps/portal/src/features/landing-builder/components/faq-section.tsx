"use client";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { LandingPageDemo } from "@/types/landing-page-type";

export type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

export type FAQData = {
    title: string;
    subTitle: string;
    items: FAQItem[];
};

const FAQ_ACCORDION_VALUE = "faq-section";

type FAQSectionProps = {
    landingPage?: LandingPageDemo;
};

export const FAQSection = ({ landingPage: _landingPage }: FAQSectionProps) => {
    const { control } = useFormContext<LandingPageFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "faq.items",
    });

    const handleAddFAQItem = () => {
        append({
            id: crypto.randomUUID?.() ?? Date.now().toString(),
            question: "",
            answer: "",
        });
    };

    return (
        <Accordion type="single" collapsible className="bg-card rounded-lg border">
            <AccordionItem value={FAQ_ACCORDION_VALUE} className="border-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline md:px-6 md:py-5">
                    <div className="flex flex-col items-start gap-0.5 text-left">
                        <span className="text-lg font-semibold">FAQ Section</span>
                        <span className="text-muted-foreground text-sm font-normal">
                            Add frequently asked questions to your landing page
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-0 pb-4 md:px-6 md:pb-6">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-4">
                            <CustomFormInput<LandingPageFormValues>
                                control={control}
                                name="faq.title"
                                label="FAQ Section Title"
                                placeholder="e.g., Frequently Asked Questions"
                            />
                            <CustomFormInput<LandingPageFormValues>
                                control={control}
                                name="faq.subTitle"
                                label="FAQ Section Subtitle"
                                placeholder="e.g., Find answers to common questions"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Questions & Answers</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddFAQItem}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Question
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="space-y-3 rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm font-medium">
                                            Question {index + 1}
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
                                        name={`faq.items.${index}.question`}
                                        label="Question"
                                        placeholder="Enter your question"
                                    />
                                    <CustomFormTextarea<LandingPageFormValues>
                                        control={control}
                                        name={`faq.items.${index}.answer`}
                                        label="Answer"
                                        placeholder="Enter the answer"
                                        rows={3}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
