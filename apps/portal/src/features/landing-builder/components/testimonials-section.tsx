"use client";

import { useFormContext } from "react-hook-form";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { FileUpload } from "@/components/file-upload";

export const TestimonialsSection = () => {
    const { control, watch, setValue } = useFormContext<LandingPageFormValues>();
    const images = watch("testimonials.images") ?? [];

    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <div>
                <h2 className="mb-2 text-lg font-semibold">আমাদের কাস্টমার রিভিউ (Customer Review)</h2>
                <p className="text-muted-foreground text-sm">
                    Add a title and upload review images (e.g. chat screenshots). You can add any number of images.
                </p>
            </div>

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
    );
};
