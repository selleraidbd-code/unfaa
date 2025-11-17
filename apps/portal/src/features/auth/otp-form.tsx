"use client";

import { useRouter } from "next/navigation";

import { useReSendVerificationSignupOTPMutation } from "@/redux/api/auth-api";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { ErrorResponse } from "@/redux/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "@workspace/ui/components/input-otp";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { verifyEmailAction } from "@/actions/auth-actions";
import logo from "@/assets/images/logo.png";
import { CustomButton } from "@/components/ui/custom-button";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import useTimeCounter from "@/hooks/useTimeCounter";
import { logoutThunkWithoutReload } from "@/redux/slices/auth-slice";
import { CardDescription, CardTitle } from "@workspace/ui/components/card";
import CustomOTPFormInput from "@workspace/ui/components/custom/custom-OTP-form-input";
import { Form } from "@workspace/ui/components/form";
import { Separator } from "@workspace/ui/components/separator";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";

const FormSchema = z.object({
    otp: z.string().min(4, {
        message: "ওটিপি কোড দিতে হবে।",
    }),
});

const OTPVerifyForm = () => {
    const router = useRouter();
    const user = useAppSelector((state) => state?.auth?.user);
    const email = user?.email;
    const dispatch = useAppDispatch();
    const { countingTime, isEnd, reset } = useTimeCounter(30);

    const [error, setError] = useState<string | null>(null);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [reSendVerificationSignupOTP, { isLoading: isResendLoading }] =
        useReSendVerificationSignupOTPMutation();
    const onSuccess = useAuthSuccess();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!email || email.trim() === "") {
            return handleBackToSignIn();
        }

        startTransition(async () => {
            const response = await verifyEmailAction(email, Number(data.otp));

            if (response.status === "success") {
                toast.success("Verification has been successfully completed.");
                onSuccess({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
                    path: "/onboarding",
                });
            } else {
                if (response.error?.status === 406) {
                    handleResendOpt();
                    form.reset();
                    toast.error("The verification code has been resent.");
                } else {
                    setError(
                        response.error || "Invalid OTP. Please try again."
                    );
                }
            }
        });
    };

    const handleResendOpt = async () => {
        if (!email || email.trim() === "") {
            setError("You are not authorized");
            return handleBackToSignIn();
        }

        setError(null);
        setResendSuccess(false);

        await reSendVerificationSignupOTP({ email: user.email })
            .unwrap()
            .then(() => {
                toast.success("OTP code has been sent.");
                setResendSuccess(true);
                reset();
                // Hide success message after 5 seconds
                setTimeout(() => setResendSuccess(false), 5000);
            })
            .catch((err: ErrorResponse) => {
                toast.error(err.message || "OTP code has not been sent.");
                setResendSuccess(false);
            });
    };

    const handleBackToSignIn = () => {
        dispatch(logoutThunkWithoutReload());
        setTimeout(() => {
            console.log("Back to sign in");
            router.replace("/auth/sign-in");
        }, 100);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-sm overflow-hidden"
            >
                <div className="text-center mb-6">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="mx-auto   flex items-center justify-center mb-1"
                    />

                    <CardTitle className="text-2xl italic font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Verification <span className="">Code</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                        {email && (
                            <>
                                We&apos;ve sent a verification code to{" "}
                                <span className="font-semibold">{email}</span>
                            </>
                        )}
                        {!email &&
                            "We have sent a verification code to your email address"}
                    </CardDescription>
                </div>

                <CustomOTPFormInput
                    pattern={REGEXP_ONLY_DIGITS}
                    control={form.control}
                    name="otp"
                    placeholder="*"
                />

                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {resendSuccess && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span>
                                Verification email resent successfully to{" "}
                                <strong>{email}</strong>. Please check your
                                inbox.
                            </span>
                        </div>
                    </div>
                )}

                <CustomButton
                    isLoading={isPending}
                    className="mt-6 w-full"
                    type="submit"
                >
                    Verify Email
                </CustomButton>

                <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">
                        Didn&apos;t receive the code?{" "}
                    </span>
                    <button
                        type="button"
                        onClick={handleResendOpt}
                        disabled={isResendLoading || !isEnd}
                        className="text-primary font-semibold hover:underline disabled:opacity-50"
                    >
                        {isResendLoading ? "Sending..." : "Resend"}
                    </button>
                    {!isEnd && (
                        <span className="text-muted-foreground ml-1">
                            (after {countingTime}s)
                        </span>
                    )}
                </div>

                <div className="my-2 flex items-center justify-center text-center text-sm">
                    <Separator className="w-1/2" />
                    <span className="text-muted-foreground mx-2">OR</span>
                    <Separator className="w-1/2" />
                </div>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Back to </span>
                    <button
                        type="button"
                        onClick={handleBackToSignIn}
                        className="text-primary cursor-pointer font-semibold hover:underline"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </Form>
    );
};

export default OTPVerifyForm;
