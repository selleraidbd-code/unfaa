"use client";

import { useSearchParams } from "next/navigation";

import { AdvancedModeBuilder } from "@/features/landing-builder/components/AdvancedModeBuilder";
import { ConfigSelectDialogForLandingPage } from "@/features/landing-builder/components/config-select-dialog-for-landing-page";
import { EasyModeBuilder } from "@/features/landing-builder/components/EasyModeBuilder";
import { useGetLandingPageWithProductIdQuery } from "@/redux/api/landing-page-api";
import { EPageType } from "@workspace/ui/landing/types";

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

    if (landingPageLoading) return <div>Loading...</div>;
    if (landingPageError) return <div>Error</div>;

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
