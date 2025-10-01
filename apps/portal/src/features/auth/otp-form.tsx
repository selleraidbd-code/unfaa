"use client";

import { useRouter } from "next/navigation";

import {
    useReSendVerificationSignupOTPMutation,
    useVerifySignupOTPMutation,
} from "@/redux/api/auth-api";
import { setToken, setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { ErrorResponse } from "@/redux/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "@workspace/ui/components/input-otp";
import { useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import { z } from "zod";

import { CustomButton } from "@/components/ui/custom-button";
import useTimeCounter from "@/hooks/useTimeCounter";
import { CardDescription, CardTitle } from "@workspace/ui/components/card";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import CustomOTPFormInput from "@workspace/ui/components/custom/custom-OTP-form-input";
import { Form } from "@workspace/ui/components/form";
import Image from "next/image";
import logo from "../../assets/images/logo.png";
const FormSchema = z.object({
    otp: z.string().min(4, {
        message: "ওটিপি কোড দিতে হবে।",
    }),
});

const OTPVerifyForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { countingTime, isEnd, reset } = useTimeCounter(30);
    const user = useAppSelector((state) => state?.auth?.user);

    const [verifySignupOTP, { isLoading }] = useVerifySignupOTPMutation();
    const [reSendVerificationSignupOTP, { isLoading: isResendLoading }] =
        useReSendVerificationSignupOTPMutation();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    });

    const handleSubmit = async () => {
        const otp = form.getValues("otp");
        if (!otp) {
            toast.error("You need to enter the OTP code.");
            return;
        }

        verifySignupOTP({
            token: parseInt(otp),
        })
            .unwrap()
            .then((res) => {
                console.log(res);
                dispatch(setUser(res.user));
                dispatch(setToken(res.accessToken));

                toast.success("Verification has been successfully completed.");
                router.replace("/onboarding");
            })
            .catch((er) => {
                if (er?.status === 406) {
                    handleResendOpt();
                    form.reset();
                    toast.error("The verification code has been resent.");
                } else {
                    toast.error(er?.data?.message || "Something went wrong.");
                }
            });
    };

    const handleResendOpt = async () => {
        if (!user) {
            return toast.error("Email not received.");
        }
        await reSendVerificationSignupOTP({ email: user.email })
            .unwrap()
            .then(() => {
                toast.success("OTP code has been sent.");
                reset();
            })
            .catch((err: ErrorResponse) => {
                toast.error(err.message || "OTP code has not been sent.");
            });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-sm">
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
                        We have sent a verification code to your email address
                    </CardDescription>
                </div>

                <CustomOTPFormInput
                    pattern={REGEXP_ONLY_DIGITS}
                    control={form.control}
                    name="otp"
                    placeholder="*"
                />

                <CustomButton
                    isLoading={isLoading}
                    className="mt-6 w-full"
                    type="submit"
                >
                    Next
                </CustomButton>

                <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleResendOpt}
                        disabled={isResendLoading || !isEnd}
                        className="hover:text-primary-hover text-blue-500 cursor-pointer text-gradient underline transition-all disabled:opacity-50"
                    >
                        Resend the code.
                    </button>
                    {!isEnd && <span>After {countingTime} seconds.</span>}
                    {isResendLoading && <CustomLoading size="none" />}
                </div>
            </form>
        </Form>
    );
};

export default OTPVerifyForm;
