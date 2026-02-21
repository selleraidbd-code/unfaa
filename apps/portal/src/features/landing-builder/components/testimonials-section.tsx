"use client";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { useFormContext } from "react-hook-form";

import { FileUpload } from "@/components/file-upload";

const TESTIMONIALS_ACCORDION_VALUE = "testimonials-section";

export const TestimonialsSection = () => {
    const { control, watch, setValue } = useFormContext<LandingPageFormValues>();
    const images = watch("testimonials.images") ?? [];

    return (
        <Accordion type="single" collapsible className="bg-card rounded-lg border">
            <AccordionItem value={TESTIMONIALS_ACCORDION_VALUE} className="border-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6 lg:py-5">
                    <div className="flex flex-col items-start gap-0.5 text-left">
                        <span className="text-lg font-semibold">আমাদের কাস্টমার রিভিউ (Customer Review)</span>
                        <span className="text-muted-foreground text-sm font-normal">
                            Add a title and upload review images (e.g. chat screenshots). You can add any number of
                            images.
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-0 pb-4 lg:px-6 lg:pb-6">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-4">
                            <CustomFormInput<LandingPageFormValues>
                                control={control}
                                name="testimonials.title"
                                label="Section Title"
                                placeholder="e.g., আমাদের কাস্টমার রিভিউ"
                            />
                            <CustomFormInput<LandingPageFormValues>
                                control={control}
                                name="testimonials.subTitle"
                                label="Section Subtitle (optional)"
                                placeholder="e.g., Our Customer Review"
                            />
                        </div>

                        <FileUpload
                            label="Review images"
                            limit={30}
                            initialFiles={Array.isArray(images) ? images : []}
                            onFilesSelected={(files) => {
                                const urls = files.map((f) => f.url).filter(Boolean);
                                setValue("testimonials.images", urls);
                            }}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
