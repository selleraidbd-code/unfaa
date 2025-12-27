"use client";

import { useState } from "react";

import { config } from "@/config";
import { ProductSelectDialogForLandingPage } from "@/features/landing-builder/components/product-select-dialog-for-landing-page";
import { useGetLandingPagesQuery } from "@/redux/api/landing-page-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { formatDateWithTime } from "@workspace/ui/lib/formateDate";
import { Calendar, Edit, ExternalLink, Globe } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

    const { data, isLoading, isError } = useGetLandingPagesQuery({
        shopId: user?.shop.id,
    });

    const getLandingPageUrl = (pageSlug: string) => {
        return `${config.nodeEnv === "development" ? "http" : "https"}://${user?.shop?.slug}.${config.rootDomain}/${pageSlug}`;
    };

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
                            <Card key={landingPage.id} className="transition-shadow duration-200 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="sub-title line-clamp-2">{landingPage.name}</CardTitle>

                                    <CardDescription className="flex items-center gap-1 text-sm">
                                        <Globe className="size-3" />/{landingPage.slug}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                        <Calendar className="size-3" />
                                        Created : {formatDateWithTime(landingPage.createdAt)}
                                    </div>
                                </CardContent>

                                <CardFooter className="grid grid-cols-2 gap-4">
                                    <CustomButton
                                        variant="outline"
                                        href={`/landing-page/builder?productId=${landingPage.productId}`}
                                        className="w-full"
                                    >
                                        <Edit className="size-4" />
                                        Edit Page
                                    </CustomButton>

                                    <CustomButton
                                        target="_blank"
                                        href={getLandingPageUrl(landingPage.slug)}
                                        className="w-full"
                                    >
                                        <ExternalLink className="size-4" />
                                        View Page
                                    </CustomButton>
                                </CardFooter>
                            </Card>
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
