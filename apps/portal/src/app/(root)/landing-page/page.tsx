"use client";

import { useState } from "react";

import { LandingPageCard } from "@/features/landing-builder/components/landing-page-card";
import { ProductSelectDialogForLandingPage } from "@/features/landing-builder/components/product-select-dialog-for-landing-page";
import { useGetLandingPagesQuery } from "@/redux/api/landing-page-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";

import { CustomButton } from "@/components/ui/custom-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

    const { data, isLoading, isError } = useGetLandingPagesQuery({
        shopId: user?.shop.id,
    });

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Landing Pages</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your Landing Pages!</p>
                    </div>

                    <CustomButton onClick={() => setProductSelectModalOpen(true)}>Add Landing Page</CustomButton>
                </div>

                <DataStateHandler
                    data={data?.data}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={data?.data.length === 0}
                    emptyTitle="No landing pages found"
                    emptyDescription="Create your first landing page to get started with building your online presence."
                    emptyButton={<Button onClick={() => setProductSelectModalOpen(true)}>Create Landing Page</Button>}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {(landingPages) =>
                        landingPages.map((landingPage) => (
                            <LandingPageCard key={landingPage.id} landingPage={landingPage} />
                        ))
                    }
                </DataStateHandler>
            </div>

            {productSelectModalOpen && (
                <ProductSelectDialogForLandingPage
                    open={productSelectModalOpen}
                    onClose={() => setProductSelectModalOpen(false)}
                />
            )}
        </>
    );
};

export default Page;
