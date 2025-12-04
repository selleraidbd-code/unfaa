import { SignInForm } from "@/features/auth/sign-in-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import Image from "next/image";
import logo from "@/assets/icons/logo.svg";
import { SocialLogin } from "@/features/auth/social-login";

const Page = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <Card className="w-full gap-0 max-w-md shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={100}
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
                    <SocialLogin />
                    <SignInForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
