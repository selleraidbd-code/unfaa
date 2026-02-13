"use client";

import { useState } from "react";

import { ConfigSelectDialogForLandingPage } from "@/features/landing-builder/components/config-select-dialog-for-landing-page";
import { LandingPageCard } from "@/features/landing-builder/components/landing-page-card";
import { useGetLandingPagesQuery } from "@/redux/api/landing-page-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";

import { CustomButton } from "@/components/ui/custom-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [configSelectModalOpen, setConfigSelectModalOpen] = useState(false);

    const { data, isLoading, isError } = useGetLandingPagesQuery({
        shopId: user?.shop.id,
    });

    return (
        <>
            <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="title lg:text-2xl">Landing Pages</h2>
                        <p className="text-muted-foreground text-sm max-sm:hidden">
                            Here&apos;s a list of your Landing Pages!
                        </p>
                    </div>

                    <CustomButton onClick={() => setConfigSelectModalOpen(true)}>Add Landing Page</CustomButton>
                </div>

                <DataStateHandler
                    data={data?.data}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={data?.data.length === 0}
                    emptyTitle="No landing pages found"
                    emptyDescription="Create your first landing page to get started with building your online presence."
                    emptyButton={<Button onClick={() => setConfigSelectModalOpen(true)}>Create Landing Page</Button>}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {(landingPages) =>
                        landingPages.map((landingPage) => (
                            <LandingPageCard key={landingPage.id} landingPage={landingPage} />
                        ))
                    }
                </DataStateHandler>
            </div>

            {configSelectModalOpen && (
                <ConfigSelectDialogForLandingPage
                    open={configSelectModalOpen}
                    onClose={() => setConfigSelectModalOpen(false)}
                />
            )}
        </>
    );
};

export default Page;
