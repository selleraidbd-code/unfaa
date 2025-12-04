import logo from "@/assets/icons/logo.svg";
import SignUpForm from "@/features/auth/sign-up-form";
import { SocialLogin } from "@/features/auth/social-login";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
                <Card className="w-full bg-background/80 gap-2 shadow-2xl">
                    <CardHeader className="text-center ">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={100}
                            height={40}
                            className="mx-auto flex items-center justify-center mb-2"
                        />

                        <CardTitle className="text-2xl italic font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Sign Up
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base">
                            Create an account to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SocialLogin />
                        <SignUpForm />
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                    By clicking continue, you agree to our{" "}
                    <Link className="text-blue-500" href="/terms-of-service">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link className="text-blue-500" href="/privacy-policy">
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
};

export default Page;
