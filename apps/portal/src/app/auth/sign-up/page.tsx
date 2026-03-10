import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import SignUpForm from "@/features/auth/sign-up-form";
import { SocialLogin } from "@/features/auth/social-login";

import { Logo } from "@/components/shared/logo";

const Page = () => {
    return (
        <AuthWrapper>
            <div>
                <Logo size="sm" />

                <div className="mt-4 space-y-1">
                    <h1 className="text-2xl font-semibold">Create an Account</h1>
                    <p className="text-muted-foreground text-sm">Create an account to get started</p>
                </div>

                <SocialLogin />
                <SignUpForm />
            </div>
        </AuthWrapper>
    );
};

export default Page;
