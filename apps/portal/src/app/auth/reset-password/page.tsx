import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/icons/logo.svg";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { Card, CardDescription, CardTitle } from "@workspace/ui/components/card";

const ResetPassword = () => {
    return (
        <div className="center bg-accent h-svh">
            <div className="mx-auto flex flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
                <Card className="p-6">
                    <div className="space-y-4 pb-4 text-left">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={100}
                            height={40}
                            className="mx-auto mb-1 flex items-center justify-center"
                        />
                        <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent italic">
                            Reset your password
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600">
                            Enter the OTP code sent to your email and create a new password.
                        </CardDescription>
                    </div>

                    <ResetPasswordForm />

                    <p className="mt-4 px-8 text-center text-sm">
                        Remember your password?{" "}
                        <Link
                            href="/auth/sign-in"
                            className="text-primary/80 hover:text-primary underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
