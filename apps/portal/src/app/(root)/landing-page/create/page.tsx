"use client";

import { EmptyErrorLoadingHandler } from "@/components/shared/empty-error-loading-handler";
import { ProductSelectDialogForLandingPage } from "@/features/landing-builder/components/product-select-dialog-for-landing-page";
import { ShowSelectedTemplate } from "@/features/landing-builder/components/ShowSelectedTemplate";
import { TemplateSelectableCard } from "@/features/templates/TemplateSelectableCard";
import { useGetLandingPagesTemplateQuery } from "@/redux/api/landing-page-template-api";
import { LandingPageDemo } from "@/types/site-type";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    const [selectedTemplate, setSelectedTemplate] =
        useState<LandingPageDemo | null>(null);

    const {
        data: templates,
        isLoading: templatesLoading,
        isError: templatesError,
    } = useGetLandingPagesTemplateQuery({});

    return (
        <>
            {selectedTemplate && (
                <ShowSelectedTemplate
                    templateId={selectedTemplate.id as string}
                    productId={productId as string}
                />
            )}

            {!selectedTemplate && (
                <EmptyErrorLoadingHandler
                    isLoading={templatesLoading}
                    isError={templatesError}
                    isEmpty={templates?.data.length === 0}
                >
                    <div className="border p-4 text-center rounded-md">
                        <h2 className="title pb-1 text-primary">
                            Select a template
                        </h2>
                        <p className="text-muted-foreground pb-6">
                            Select a template to create a landing page
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates?.data.map((template) => (
                                <TemplateSelectableCard
                                    key={template.id}
                                    template={template}
                                    onSelect={(template) =>
                                        setSelectedTemplate(template)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </EmptyErrorLoadingHandler>
            )}

            {!productId && <ProductSelectDialogForLandingPage open={true} />}
        </>
    );
};

export default Page;
