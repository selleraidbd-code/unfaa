"use client";

import { signUpFormSchema } from "@/features/auth/auth-schemas";
import { clearAuth, setAuth } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../../assets/images/logo.png";

import { CustomButton } from "@/components/ui/custom-button";
import { useSignUpMutation } from "@/redux/api/auth-api";
import { persistor } from "@/redux/store";
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
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignUpForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [signUp, { isLoading }] = useSignUpMutation();

    const [message, setMessage] = useState("");

    const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
        setMessage("");
        dispatch(clearAuth());
        persistor.purge();

        if (data.password !== data.confirmPassword) {
            setMessage("Password and Confirm Password do not match");
            return;
        }
        await signUp({
            name: data.name,
            email: data.email,
            password: data.password,
        })
            .unwrap()
            .then((res) => {
                dispatch(setAuth(res.data));
                router.push("/auth/verify-user");
            })
            .catch((error) => {
                setMessage(error.message);
            });
    };

    return (
        <div
            className={cn("flex flex-col gap-6 w-full max-w-md", className)}
            {...props}
        >
            <Card className="w-full shadow-2xl">
                <CardHeader className="text-center ">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="mx-auto   flex items-center justify-center mb-1"
                    />

                    <CardTitle className="text-2xl italic font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                {/* <SocialLogin /> */}
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

                                    {message && (
                                        <CustomFormError message={message} />
                                    )}

                                    <CustomButton
                                        type="submit"
                                        className="w-full "
                                        isLoading={isLoading}
                                    >
                                        Sign Up
                                    </CustomButton>
                                </div>

                                <div className="text-center text-blue-500 text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        href="/auth/sign-in"
                                        className="pl-1 underline underline-offset-4 hover:text-primary"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our{" "}
                <a className="text-blue-500" href="#">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-blue-500" href="#">
                    Privacy Policy
                </a>
                .
            </div>
        </div>
    );
};

export default SignUpForm;
