import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { SignInForm } from "@/features/auth/sign-in-form";
import { SocialLogin } from "@/features/auth/social-login";

import { Logo } from "@/components/shared/logo";

const Page = () => {
    return (
        <AuthWrapper>
            <div>
                <Logo size="sm" />

                <div className="mt-4 mb-2 space-y-1">
                    <h1 className="text-2xl font-semibold">Welcome Back</h1>
                    <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
                </div>

                <SocialLogin />
                <SignInForm />
            </div>
        </AuthWrapper>
    );
};

export default Page;
