"use client";

import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { MessageCircle, Phone } from "lucide-react";

export type ContactData = {
    whatsappNumber: string;
    facebookPageId: string;
};

type ContactSectionProps = {
    whatsappNumber: string;
    facebookPageId: string;
    onWhatsappNumberChange: (value: string) => void;
    onFacebookPageIdChange: (value: string) => void;
};

export const ContactSection = ({
    whatsappNumber,
    facebookPageId,
    onWhatsappNumberChange,
    onFacebookPageIdChange,
}: ContactSectionProps) => {
    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <div>
                <h2 className="mb-2 text-lg font-semibold">যোগাযোগ সেকশন</h2>
                <p className="text-muted-foreground text-sm">
                    WhatsApp বা Facebook Messenger এর মাধ্যমে গ্রাহকদের সাথে যোগাযোগের জন্য আপনার তথ্য যোগ করুন
                </p>
            </div>

            <div className="space-y-4">
                <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-full bg-green-100 p-2">
                            <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">WhatsApp</h3>
                            <p className="text-muted-foreground text-xs">আপনার WhatsApp নম্বর যোগ করুন</p>
                        </div>
                    </div>
                    <CustomInput
                        label="WhatsApp Number"
                        placeholder=" বাংলাদেশের জন্য +880 যোগ করুন (e.g., +8801700000000)"
                        value={whatsappNumber}
                        onChange={(value) => onWhatsappNumberChange(String(value))}
                    />
                </div>

                <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-2">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">Facebook Messenger</h3>
                            <p className="text-muted-foreground text-xs">আপনার Facebook পেজ ID বা username যোগ করুন</p>
                        </div>
                    </div>
                    <CustomInput
                        label="Facebook Page ID or Username"
                        value={facebookPageId}
                        onChange={(value) => onFacebookPageIdChange(String(value))}
                        placeholder="আপনার Facebook পেজের username দিন (@ ছাড়া) অথবা Page ID"
                    />
                </div>
            </div>
        </div>
    );
};
