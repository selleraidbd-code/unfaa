import Link from "next/link";

import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { ForgotForm } from "@/features/auth/forgot-form";

import { Logo } from "@/components/shared/logo";

const Page = () => {
    return (
        <AuthWrapper>
            <div>
                <Logo size="sm" />

                <div className="mt-6 mb-4 space-y-1">
                    <h1 className="text-2xl font-semibold">Forgot your password?</h1>
                    <p className="text-muted-foreground text-sm">
                        If you have an account with us you will receive an email with 6 digit OTP for verification.
                    </p>
                </div>

                <ForgotForm />

                <p className="mt-4 px-8 text-center text-sm">
                    Already have an account?{" "}
                    <Link
                        href="/auth/sign-in"
                        className="text-primary/80 hover:text-primary underline underline-offset-4"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthWrapper>
    );
};

export default Page;
