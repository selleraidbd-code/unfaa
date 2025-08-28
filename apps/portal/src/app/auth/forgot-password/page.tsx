import Link from "next/link";

import { ForgotForm } from "@/features/auth/forgot-form";

import { Card, CardDescription, CardTitle } from "@repo/ui/components/ui/card";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

const ForgotPassword = () => {
    return (
        <div className="h-svh center bg-accent">
            <div className="mx-auto flex flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
                <Card className="p-6">
                    <div className="text-left space-y-4 pb-4">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="mx-auto flex items-center justify-center mb-1"
                        />
                        <CardTitle className="text-2xl italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Forgot your password?
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base">
                            If you have an account with us you will receive an
                            email with 6 digit OTP for verification.
                        </CardDescription>
                    </div>
                    <ForgotForm loading={false} />

                    <p className="mt-4 px-8 text-center text-blue-500 text-sm ">
                        Already have an account?{" "}
                        <Link
                            href="/auth/sign-in"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
