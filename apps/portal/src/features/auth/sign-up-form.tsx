"use client";

import { signUpFormSchema } from "@/features/auth/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { registerAction } from "@/actions/auth-actions";
import { CustomButton } from "@/components/ui/custom-button";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { CustomFormError } from "@workspace/ui/components/custom/custom-form-error";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { Form } from "@workspace/ui/components/form";

const SignUpForm = () => {
    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const onSuccess = useAuthSuccess();

    const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
        startTransition(async () => {
            if (data.password !== data.confirmPassword) {
                setError("Password and Confirm Password do not match");
                return;
            }

            const response = await registerAction(
                data.name,
                data.email,
                data.password
            );

            if (response.status === "success") {
                onSuccess({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
                    path: "/auth/verify-email",
                });
            } else {
                setError(response.error || "Something went wrong");
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    <div className="grid gap-4">
                        <CustomFormInput
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                            type="text"
                            control={form.control}
                            required
                        />

                        <CustomFormInput
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            control={form.control}
                            required
                        />

                        <CustomFormInput
                            name="password"
                            label="Password"
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

                        <CustomButton
                            type="submit"
                            className="w-full "
                            isLoading={isPending}
                        >
                            Sign Up
                        </CustomButton>
                    </div>

                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/auth/sign-in"
                            className="pl-1 underline text-primary/80 underline-offset-4 hover:text-primary"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default SignUpForm;
