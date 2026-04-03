"use client";

import { useState } from "react";

import type { LandingPageFormValues } from "@/features/landing-builder/landing-page-form-schema";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { useFormContext } from "react-hook-form";

export const BasicInfoSection = () => {
    const { control } = useFormContext<LandingPageFormValues>();
    const [showCustomThemeColors, setShowCustomThemeColors] = useState(false);

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

            <CustomFormInput<LandingPageFormValues>
                control={control}
                name="contact.specialNote"
                label="Special Note ( অর্ডার ফর্মে বিশেষ নোট যোগ করুন )"
                placeholder="e.g., আপনার পছন্দের রং বা সাইজ লিখুন"
            />

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 rounded-md border border-transparent py-1">
                    <div className="space-y-0.5">
                        <Label htmlFor="custom-theme-colors" className="text-sm font-medium">
                            Custom theme colors
                        </Label>
                        <p className="text-muted-foreground text-xs">
                            When off, the landing page uses built-in defaults. Turn on to pick primary and accent
                            colors.
                        </p>
                    </div>
                    <Switch
                        id="custom-theme-colors"
                        checked={showCustomThemeColors}
                        onCheckedChange={setShowCustomThemeColors}
                    />
                </div>
            </div>

            {showCustomThemeColors ? (
                <div className="grid gap-4 md:grid-cols-2">
                    <CustomFormInput<LandingPageFormValues>
                        control={control}
                        type="color"
                        name="contact.primaryColor"
                        label="Primary Color"
                        placeholder="e.g. #3B82F6"
                    />

                    <CustomFormInput<LandingPageFormValues>
                        control={control}
                        type="color"
                        name="contact.secondaryColor"
                        label="Secondary Color"
                        placeholder="e.g. #10B981"
                    />
                </div>
            ) : null}
        </div>
    );
};
