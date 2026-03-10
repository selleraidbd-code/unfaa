import Link from "next/link";

import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

import { Logo } from "@/components/shared/logo";

const Page = () => {
    return (
        <AuthWrapper>
            <div>
                <Logo size="sm" />

                <div className="mt-4 mb-2 space-y-1">
                    <h1 className="text-2xl font-semibold">Reset your password</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter the OTP code sent to your email and create a new password.
                    </p>
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
            </div>
        </AuthWrapper>
    );
};

export default Page;
