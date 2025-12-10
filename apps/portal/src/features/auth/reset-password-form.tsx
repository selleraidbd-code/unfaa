"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useResetPasswordMutation } from "@/redux/api/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormError } from "@workspace/ui/components/custom/custom-form-error";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import CustomOTPFormInput from "@workspace/ui/components/custom/custom-OTP-form-input";
import { Form } from "@workspace/ui/components/form";
import { REGEXP_ONLY_DIGITS } from "@workspace/ui/components/input-otp";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "@/components/ui/custom-button";

const resetPasswordSchema = z
    .object({
        otp: z.string().min(4, { message: "Please enter the 4-digit OTP" }).max(4),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            otp: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        if (!email) {
            setError("Email is required");
            return;
        }

        await resetPassword({
            email,
            token: Number(data.otp),
            password: data.password,
        })
            .unwrap()
            .then(() => {
                toast.success("Password reset successfully");
                router.push("/auth/sign-in");
            })
            .catch((error) => {
                setError(error.data.message);
            });
    };

    if (!email) {
        return (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                Email is required. Please go back to the forgot password page.
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">OTP Code</label>
                            <CustomOTPFormInput
                                pattern={REGEXP_ONLY_DIGITS}
                                control={form.control}
                                name="otp"
                                placeholder="*"
                            />
                        </div>

                        <CustomFormInput
                            name="password"
                            label="New Password"
                            placeholder="********"
                            type="password"
                            control={form.control}
                            required
                        />

                        <CustomFormInput
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="********"
                            type="password"
                            control={form.control}
                            required
                        />

                        <CustomFormError message={error || undefined} />

                        <CustomButton type="submit" className="w-full" isLoading={isLoading}>
                            Reset Password
                        </CustomButton>
                    </div>
                </div>
            </form>
        </Form>
    );
};
