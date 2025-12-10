"use client";

import { useRouter } from "next/navigation";

import { useSendForgotPasswordEmailMutation } from "@/redux/api/auth-api";
import { ErrorResponse } from "@/redux/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "@/components/ui/custom-button";

const formSchema = z.object({
    email: z.string().min(1, { message: "Please enter your email" }).email({ message: "Invalid email address" }),
});

export const ForgotForm = () => {
    const router = useRouter();
    const [sendForgotPasswordEmail, { isLoading }] = useSendForgotPasswordEmailMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await sendForgotPasswordEmail({ email: data.email })
            .unwrap()
            .then(() => {
                toast.success("Password reset email sent successfully!");
                router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
            })
            .catch((error) => {
                const err = error as ErrorResponse;
                toast.error(err.message || "Failed to send password reset email");
            });
    };

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CustomButton isLoading={isLoading}>Continue</CustomButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};
