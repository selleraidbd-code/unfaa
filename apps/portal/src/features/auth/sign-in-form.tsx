"use client";

import { signInFormSchema } from "@/features/auth/auth-schemas";
import { clearAuth, setAuth } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "@/components/ui/custom-button";
import { useSignInMutation } from "@/redux/api/auth-api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { CustomFormError } from "@workspace/ui/components/custom/custom-form-error";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { Form } from "@workspace/ui/components/form";
import Image from "next/image";
import logo from "../../assets/images/logo.png";

const SignInForm = () => {
    const dispatch = useAppDispatch();
    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const [message, setMessage] = useState<string | undefined>("");
    const [signIn, { isLoading }] = useSignInMutation();

    const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
        setMessage("");
        dispatch(clearAuth());
        const { email, password } = data;
        console.log(email, password);
        await signIn({ email, password })
            .unwrap()
            .then((data) => {
                if (data?.data?.user) {
                    dispatch(setAuth(data.data));
                    router.push("/");
                }
            })
            .catch(() => {
                setMessage("Invalid email or password");
            });
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
                {/* <Sparkles className="w-6 h-6 text-white" /> */}
                <Image
                    src={logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="mx-auto flex items-center justify-center mb-1"
                />

                <CardTitle className="text-2xl italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                    Sign in to your account to continue your journey
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            {/* <SocialLogin /> */}
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

                                <CustomFormError message={message} />

                                <CustomButton
                                    type="submit"
                                    className="w-full  "
                                    isLoading={isLoading}
                                >
                                    Sign In
                                </CustomButton>
                            </div>

                            <div className="text-center text-blue-500 text-sm">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/sign-up"
                                    className="hover:text-primary pl-1 underline underline-offset-4"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
            {/* <CustomSwiper items={items} /> */}
        </Card>
    );
};

export default SignInForm;
