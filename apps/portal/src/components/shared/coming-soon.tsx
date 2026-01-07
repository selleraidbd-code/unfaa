"use client";

import { useAppSelector } from "@/redux/store/hook";

export const ComingSoon = () => {
    const user = useAppSelector((state) => state.auth.user);
    console.warn("user", user);

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="mx-auto max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-primary/10 rounded-full p-6">
                        <svg className="text-primary h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="mb-3 text-3xl font-bold tracking-tight">Coming Soon</h1>
                <p className="text-muted-foreground mb-2 text-lg">We're working on something exciting!</p>
                <p className="text-muted-foreground text-sm">
                    This feature is currently under development and will be available soon.
                </p>
            </div>
        </div>
    );
};
