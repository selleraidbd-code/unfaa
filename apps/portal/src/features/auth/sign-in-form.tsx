"use client";

import { signInFormSchema } from "@/features/auth/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginAction } from "@/actions/auth-actions";
import { CustomButton } from "@/components/ui/custom-button";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { CustomFormError } from "@workspace/ui/components/custom/custom-form-error";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { Form } from "@workspace/ui/components/form";

export const SignInForm = () => {
    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const onSuccess = useAuthSuccess();

    const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
        startTransition(async () => {
            const response = await loginAction(data.email, data.password);

            if (response.status === "success") {
                onSuccess({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
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
                            name="email"
                            label="Email"
                            placeholder="m@example.com"
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
                        <div className="flex items-center text-blue-500 justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        <CustomFormError message={error || undefined} />

                        <CustomButton
                            type="submit"
                            className="w-full  "
                            isLoading={isPending}
                        >
                            Sign In
                        </CustomButton>
                    </div>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/sign-up"
                            className="hover:text-primary pl-1 underline text-primary/80 underline-offset-4"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    );
};
