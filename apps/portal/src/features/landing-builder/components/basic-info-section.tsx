"use client";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { useFormContext } from "react-hook-form";

export const BasicInfoSection = () => {
    const { control } = useFormContext<LandingPageFormValues>();

    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <CustomFormInput<LandingPageFormValues>
                control={control}
                name="name"
                label="Landing Page Title"
                placeholder="Enter landing page title"
                required
            />

            <CustomFormInput<LandingPageFormValues>
                control={control}
                name="contact.whatsappNumber"
                label="WhatsApp Number ( আপনার WhatsApp নম্বর যোগ করুন )"
                placeholder=" বাংলাদেশের জন্য +880 যোগ করুন (e.g., +8801700000000)"
            />

            <CustomFormInput<LandingPageFormValues>
                control={control}
                name="contact.facebookPageId"
                label="Facebook Messenger ( আপনার Facebook পেজ ID বা username যোগ করুন )"
                placeholder="আপনার Facebook পেজের username দিন (@ ছাড়া) অথবা Page ID"
            />
        </div>
    );
};
