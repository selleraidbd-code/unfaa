"use client";

import { useSearchParams } from "next/navigation";

import { AdvancedModeBuilder } from "@/features/landing-builder/components/AdvancedModeBuilder";
import { ConfigSelectDialogForLandingPage } from "@/features/landing-builder/components/config-select-dialog-for-landing-page";
import { EasyModeBuilder } from "@/features/landing-builder/components/EasyModeBuilder";
import { useGetLandingPageWithProductIdQuery } from "@/redux/api/landing-page-api";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { EPageType } from "@workspace/ui/landing/types";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

const Page = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");
    const mode = searchParams.get("mode");

    const {
        data: landingPage,
        isLoading: landingPageLoading,
        isError: landingPageError,
    } = useGetLandingPageWithProductIdQuery({ productId: productId as string }, { skip: !productId });

    // Check if productId and mode are provided
    if (!productId || !mode) {
        return <ConfigSelectDialogForLandingPage open={true} />;
    }

    if (landingPageLoading) return <BuilderPageSkeleton />;
    if (landingPageError) return <CustomErrorOrEmpty isError={true} title="Error" description="Something went wrong" />;

    // Render based on mode
    if (
        mode === EPageType.EASY_LANDING_PAGE_1 ||
        mode === EPageType.EASY_LANDING_PAGE_2 ||
        mode === EPageType.EASY_LANDING_PAGE_3 ||
        mode === EPageType.EASY_LANDING_PAGE_4 ||
        mode === EPageType.EASY_LANDING_PAGE_5 ||
        mode === EPageType.EASY_LANDING_PAGE_6
    ) {
        return <EasyModeBuilder productId={productId} mode={mode} landingPage={landingPage?.data} />;
    }

    if (mode === "advanced") {
        return <AdvancedModeBuilder productId={productId} landingPage={landingPage?.data} />;
    }

    // Fallback - should not reach here if mode is valid
    return <ConfigSelectDialogForLandingPage open={true} />;
};

export default Page;

function BuilderPageSkeleton() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="bg-card flex flex-col gap-4 border-b px-4 py-4 lg:px-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 overflow-auto p-4 lg:p-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg border" />
                ))}
            </div>
        </div>
    );
}
