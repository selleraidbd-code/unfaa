"use client";

import { useSearchParams } from "next/navigation";

import { AdvancedModeBuilder } from "@/features/landing-builder/components/AdvancedModeBuilder";
import { EasyModeBuilder } from "@/features/landing-builder/components/EasyModeBuilder";
import { ProductSelectDialogForLandingPage } from "@/features/landing-builder/components/product-select-dialog-for-landing-page";
import { useGetLandingPageWithProductIdQuery } from "@/redux/api/landing-page-api";

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
        return <ProductSelectDialogForLandingPage open={true} />;
    }

    if (landingPageLoading) return <div>Loading...</div>;
    if (landingPageError) return <div>Error</div>;

    // Render based on mode
    if (mode === "easy") {
        return <EasyModeBuilder productId={productId} landingPage={landingPage?.data} />;
    }

    if (mode === "advanced") {
        return <AdvancedModeBuilder productId={productId} landingPage={landingPage?.data} />;
    }

    // Fallback - should not reach here if mode is valid
    return <ProductSelectDialogForLandingPage open={true} />;
};

export default Page;
