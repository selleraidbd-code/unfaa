"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/store/hook";
import { toast } from "@workspace/ui/components/sonner";

export const VerificationProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const isShowToast = useRef(false);

    useEffect(() => {
        if (isShowToast.current) return;
        if (user === undefined) return;

        if (user?.id) {
            if (!user.isVerified) {
                router.push("/auth/verify-user");
                toast.error("Please verify your account to continue", {
                    duration: 3000,
                });
                isShowToast.current = true;
            }
        } else {
            router.push("/auth/sign-in");
            toast.error("Please sign in to continue", {
                duration: 3000,
            });
            isShowToast.current = true;
        }
    }, [user, router]);

    const shouldShowChildren = user?.id && user.isVerified;

    return shouldShowChildren ? <>{children}</> : null;
};
