"use client";

import dynamic from "next/dynamic";

const OTPVerifyForm = dynamic(() => import("@/features/auth/otp-form"), {
    ssr: false,
});

import { Card, CardContent } from "@repo/ui/components/ui/card";

export default function VerifyEmail() {
    return (
        <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
            <Card>
                <CardContent className="pt-6">
                    <OTPVerifyForm />
                </CardContent>
            </Card>
        </div>
    );
}
